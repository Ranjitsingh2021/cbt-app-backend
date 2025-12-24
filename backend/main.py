from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import sessionmaker, Session, relationship, declarative_base
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from openai import OpenAI
from langchain_core.messages import HumanMessage, AIMessage
from agent_logic import agent_executor

# Load environment variables from .env file
load_dotenv()

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./cbt_therapy.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "CBT Therapy App"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

print(f"DEBUG EMAIL CONFIG: Server={conf.MAIL_SERVER}, Port={conf.MAIL_PORT}, User={conf.MAIL_USERNAME}, From={conf.MAIL_FROM}")

async def send_reset_code_email(email: str, code: str):
    try:
        print(f"DEBUG: Attempting to send email to {email}...")
        message = MessageSchema(
            subject="Your CBT Therapy Password Reset Code",
            recipients=[email],
            body=f"Your 4-digit verification code is: {code}\n\nThis code will expire in 15 minutes.",
            subtype=MessageType.plain
        )
        fm = FastMail(conf)
        await fm.send_message(message)
        print(f"DEBUG: Email sent successfully to {email}")
    except Exception as e:
        print(f"!!! CRITICAL ERROR sending email !!!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        # If it's a FastMail/pydantic error, log more details
        if hasattr(e, 'errors'):
            print(f"Validation Errors: {e.errors()}")

# OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI app
app = FastAPI(title="CBT Therapy API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), index=True, nullable=True) # Nullable for legacy
    role = Column(String, nullable=False) # 'user' or 'ai'
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False)
    settings_data = Column(JSON, nullable=False, default=dict)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserMemory(Base):
    __tablename__ = "user_memory"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    memory_type = Column(String, nullable=False) # 'semantic' (fact) or 'episodic' (summary/event)
    content = Column(String, nullable=False)
    importance = Column(Integer, default=1) # 1-5
    created_at = Column(DateTime, default=datetime.utcnow)

class ResetCode(Base):
    __tablename__ = "reset_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

class ConversationCreate(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SettingsResponse(BaseModel):
    settings_data: dict
    user_email: str
    updated_at: datetime

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    settings_data: dict

class ChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None
    history: list = []

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    expire = datetime.utcnow() + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        print(f"DEBUG AUTH: Received token: {token[:20]}...")
        print(f"DEBUG AUTH: Using SECRET_KEY: {SECRET_KEY[:5]}...")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG AUTH: Payload decoded successfully: {payload}")
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        print(f"DEBUG AUTH: JWT Validation FAILED! Error: {str(e)}")
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.get("/")
def root():
    return {"message": "CBT Therapy API"}

@app.post("/api/auth/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_user.id
    }

@app.post("/api/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # For security, don't reveal if user exists. 
        return {"message": "If your email is registered, you will receive a code."}
    
    # Generate 4-digit code
    import random
    code = "".join([str(random.randint(0, 9)) for _ in range(4)])
    
    # Save code to DB
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    reset_entry = ResetCode(email=request.email, code=code, expires_at=expires_at)
    db.add(reset_entry)
    db.commit()
    
    # Send actual email
    background_tasks.add_task(send_reset_code_email, request.email, code)
    
    # Keep print for debugging until user confirms it works
    print("\n" + "="*50)
    print(f"🔑 VERIFICATION CODE CREATED")
    print(f"Email: {request.email}")
    print(f"Code:  {code}")
    print("="*50 + "\n")
    
    return {"message": "Verification code sent to email"}

@app.post("/api/auth/verify-reset-code")
def verify_reset_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    reset_entry = db.query(ResetCode).filter(
        ResetCode.email == request.email,
        ResetCode.code == request.code,
        ResetCode.expires_at > datetime.utcnow()
    ).order_by(ResetCode.created_at.desc()).first()
    
    if not reset_entry:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
        
    return {"message": "Code verified successfully"}

@app.post("/api/auth/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Verify code one last time
    reset_entry = db.query(ResetCode).filter(
        ResetCode.email == request.email,
        ResetCode.code == request.code,
        ResetCode.expires_at > datetime.utcnow()
    ).order_by(ResetCode.created_at.desc()).first()
    
    if not reset_entry:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    # Delete reset codes for this email
    db.query(ResetCode).filter(ResetCode.email == request.email).delete()
    db.commit()
    
    return {"message": "Password reset successfully"}

@app.get("/api/chat/conversations", response_model=list[ConversationResponse])
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.updated_at.desc()).all()

@app.post("/api/chat/conversations", response_model=ConversationResponse)
def create_conversation(conv_data: ConversationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_conv = Conversation(user_id=current_user.id, title=conv_data.title)
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv

@app.get("/api/chat/conversations/{conversation_id}/messages")
def get_conversation_messages(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify conversation belongs to user
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = db.query(ChatMessage).filter(ChatMessage.conversation_id == conversation_id).order_by(ChatMessage.created_at.asc()).all()
    return [{
        "id": str(msg.id),
        "text": msg.content,
        "sender": msg.role,
        "timestamp": msg.created_at
    } for msg in messages]

@app.get("/api/chat/history")
def get_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Legacy endpoint: returns all messages
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).all()
    return [{
        "id": str(msg.id),
        "text": msg.content,
        "sender": msg.role,
        "timestamp": msg.created_at
    } for msg in messages]



@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        if not conversation_id:
            # Always create a NEW conversation if no ID is provided
            # This prevents today's chats from being mixed into yesterday's history items
            new_conv = Conversation(user_id=current_user.id, title="New Chat")
            db.add(new_conv)
            db.commit()
            db.refresh(new_conv)
            conversation_id = new_conv.id
        else:
            # Update the last activity time for existing conversation
            conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
            if conv:
                conv.updated_at = datetime.utcnow()
                db.commit()

        # Save user message
        user_msg = ChatMessage(user_id=current_user.id, conversation_id=conversation_id, role="user", content=request.message)
        db.add(user_msg)
        db.commit()

        # Prepare history context for the LangGraph agent
        # We take the last 10 messages from the conversation history
        history_msgs = db.query(ChatMessage).filter(ChatMessage.conversation_id == conversation_id).order_by(ChatMessage.created_at.desc()).limit(11).all()
        history_msgs.reverse()
        
        langchain_messages = []
        for msg in history_msgs:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            else:
                langchain_messages.append(AIMessage(content=msg.content))

        if not os.getenv("OPENAI_API_KEY"):
             response_text = "I'm sorry, but I'm not fully configured yet (missing API Key). I hear you saying: " + request.message
        else:
            # Run the core ReAct agent with Episodic/Semantic memory
            # The agent_executor handles retrieval, response generation, and episodic persistence
            agent_result = agent_executor.invoke({
                "messages": langchain_messages,
                "user_id": current_user.id,
                "conversation_id": conversation_id
            })
            response_text = agent_result["response_text"]
        
        # Save AI response
        ai_msg = ChatMessage(user_id=current_user.id, conversation_id=conversation_id, role="ai", content=response_text)
        db.add(ai_msg)
        db.commit()

        # If this was the first user message in a "New Chat", try to generate a better title
        if conversation_id:
            conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
            if conv and conv.title == "New Chat":
                # Use first 30 chars of message as title
                conv.title = request.message[:30] + ("..." if len(request.message) > 30 else "")
                db.commit()

        return {"message": response_text, "conversation_id": conversation_id}
    except Exception as e:
        print(f"Error generating response: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# User Settings Endpoints
@app.get("/api/user/settings", response_model=SettingsResponse)
def get_user_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
        if not settings:
            print(f"DEBUG: Creating default settings for user {current_user.id}")
            settings = UserSettings(user_id=current_user.id, settings_data={})
            db.add(settings)
            db.commit()
            db.refresh(settings)
        
        # Add email dynamically to the response
        return {
            "settings_data": settings.settings_data,
            "user_email": current_user.email,
            "updated_at": settings.updated_at
        }
    except Exception as e:
        print(f"ERROR in get_user_settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/user/settings", response_model=SettingsResponse)
def update_user_settings(update: SettingsUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        print(f"DEBUG: Updating settings for user {current_user.id} with data: {update.settings_data}")
        settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
        if not settings:
            print(f"DEBUG: No existing settings found, creating new one")
            settings = UserSettings(user_id=current_user.id, settings_data=update.settings_data)
            db.add(settings)
        else:
            # Explicitly create a new dict to ensure SQLAlchemy detects the change
            new_data = dict(settings.settings_data) if settings.settings_data else {}
            new_data.update(update.settings_data)
            settings.settings_data = new_data
            print(f"DEBUG: Merged settings: {settings.settings_data}")
        
        db.commit()
        db.refresh(settings)
        return settings
    except Exception as e:
        print(f"ERROR in update_user_settings: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
