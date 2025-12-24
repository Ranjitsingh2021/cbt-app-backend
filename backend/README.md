# CBT Therapy Backend API

Minimal FastAPI backend with SQLite database for authentication.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "access_token": "...", "token_type": "bearer", "user_id": 1 }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "access_token": "...", "token_type": "bearer", "user_id": 1 }`

- `GET /api/auth/me` - Get current user info
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "id": 1, "email": "user@example.com", "created_at": "..." }`

## Database

SQLite database file: `cbt_therapy.db` (created automatically)

## Environment Variables

- `SECRET_KEY` - JWT secret key (default: "your-secret-key-change-in-production")

