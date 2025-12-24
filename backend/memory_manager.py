import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Setup ChromaDB
# Use an absolute path for safety in distributed environments
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DATA_PATH = os.path.join(BASE_DIR, "chroma_db")
os.makedirs(CHROMA_DATA_PATH, exist_ok=True)

# Initialize standard Chroma client
client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

# Use OpenAI embeddings for high-quality retrieval
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="text-embedding-3-small"
)

class MemoryManager:
    def __init__(self, user_id: int):
        self.user_id = str(user_id)
        # Separate collections per user for privacy and isolation
        self.episodic_coll = client.get_or_create_collection(
            name=f"user_{user_id}_episodic",
            embedding_function=openai_ef
        )
        self.semantic_coll = client.get_or_create_collection(
            name=f"user_{user_id}_semantic",
            embedding_function=openai_ef
        )

    def add_episodic_memory(self, content: str, metadata: Dict = None):
        """Adds a specific event or summary from a conversation."""
        import uuid
        self.episodic_coll.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[f"ep_{uuid.uuid4().hex}"]
        )

    def add_semantic_fact(self, fact: str, metadata: Dict = None):
        """Adds a long-term fact about user preferences or therapy progress."""
        import uuid
        self.semantic_coll.add(
            documents=[fact],
            metadatas=[metadata or {}],
            ids=[f"sem_{uuid.uuid4().hex}"]
        )

    def query_memories(self, query: str, limit: int = 3) -> Dict[str, List[str]]:
        """Searches both episodic and semantic memory for relevant context."""
        try:
            episodic_results = self.episodic_coll.query(
                query_texts=[query],
                n_results=limit
            )
            semantic_results = self.semantic_coll.query(
                query_texts=[query],
                n_results=limit
            )
            
            return {
                "episodic": episodic_results['documents'][0] if episodic_results['documents'] else [],
                "semantic": semantic_results['documents'][0] if semantic_results['documents'] else []
            }
        except Exception as e:
            print(f"Error querying memories for user {self.user_id}: {e}")
            return {"episodic": [], "semantic": []}
