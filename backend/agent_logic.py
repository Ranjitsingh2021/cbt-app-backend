import os
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from memory_manager import MemoryManager
from dotenv import load_dotenv

load_dotenv()

# Define the state for our LangGraph workflow
class AgentState(TypedDict):
    messages: List[BaseMessage]
    user_id: int
    conversation_id: int
    memory_context: str
    response_text: str

# Initialize the LLM with a slightly higher temperature for empathy
llm = ChatOpenAI(
    model="gpt-3.5-turbo", 
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

def retrieve_memories_node(state: AgentState):
    """
    Node: Retrieves relevant Episodic and Semantic memories based on the user's latest message.
    """
    user_id = state['user_id']
    # Get content of the last HumanMessage
    last_user_msg = ""
    for msg in reversed(state['messages']):
        if isinstance(msg, HumanMessage):
            last_user_msg = msg.content
            break
    
    if not last_user_msg:
        return {"memory_context": ""}

    mm = MemoryManager(user_id)
    memories = mm.query_memories(last_user_msg)
    
    context_parts = []
    if memories.get('semantic'):
        context_parts.append("Important facts I know about the user:\n" + "\n".join([f"- {m}" for m in memories['semantic']]))
    
    if memories.get('episodic'):
        context_parts.append("Relevant snippets from our past talks:\n" + "\n".join([f"- {m}" for m in memories['episodic']]))
    
    context = "\n\n".join(context_parts) if context_parts else "No specific past context found for this topic."
    return {"memory_context": context}

def generate_response_node(state: AgentState):
    """
    Node: Generates the actual CBT response using the retrieved memory context.
    """
    messages = state['messages']
    memory_context = state.get('memory_context', "")
    
    system_prompt = (
        "You are a compassionate and helpful CBT therapist assistant. "
        "Your goal is to guide the user through their emotional challenges using Cognitive Behavioral Therapy. "
        "Be empathetic, non-judgmental, and focused on helping them identify and challenge negative thought patterns.\n\n"
        "### CONTEXT FROM PAST CONVERSATIONS ###\n"
        f"{memory_context}\n\n"
        "Use this context to be more personal, but don't force it if it's not relevant. "
        "Keep responses concise and suitable for a mobile chat interface."
    )
    
    # Construct message list for LLM
    llm_messages = [SystemMessage(content=system_prompt)] + messages
    
    # Simple retry logic for reliability
    try:
        response = llm.invoke(llm_messages)
        return {"messages": state['messages'] + [response], "response_text": response.content}
    except Exception as e:
        print(f"Error in LLM call: {e}")
        error_msg = AIMessage(content="I'm sorry, I'm having a bit of trouble thinking clearly right now. Can you repeat that?")
        return {"messages": state['messages'] + [error_msg], "response_text": error_msg.content}

def update_memory_node(state: AgentState):
    """
    Node: Automatically persists the current interaction into Episodic memory.
    """
    user_id = state['user_id']
    try:
        user_text = state['messages'][-2].content
        ai_text = state['messages'][-1].content
        
        mm = MemoryManager(user_id)
        mm.add_episodic_memory(
            content=f"User: {user_text}\nAssistant: {ai_text}",
            metadata={"type": "interaction", "conversation_id": state['conversation_id']}
        )
    except Exception as e:
        print(f"Error updating memory: {e}")
    return {}

def extract_facts_node(state: AgentState):
    """
    Node: Analyzes the interaction to extract long-term semantic facts about the user.
    """
    user_id = state['user_id']
    user_text = state['messages'][-2].content
    
    extraction_prompt = (
        "Analyze the user's message and extract any personal facts, preferences, or goals. "
        "Return ONLY a bulleted list of facts, or 'NONE'.\n"
        f"User said: {user_text}"
    )
    
    try:
        fact_response = llm.invoke([SystemMessage(content=extraction_prompt)])
        fact_text = fact_response.content.strip()
        
        if fact_text.upper() != "NONE":
            mm = MemoryManager(user_id)
            for fact in fact_text.split("\n"):
                clean_fact = fact.strip("- ").strip()
                if clean_fact:
                    mm.add_semantic_fact(clean_fact)
    except Exception as e:
        print(f"Error extracting facts: {e}")
    return {}

# Define the Graph
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("retrieve", retrieve_memories_node)
workflow.add_node("respond", generate_response_node)
workflow.add_node("persist_episodic", update_memory_node)
workflow.add_node("persist_semantic", extract_facts_node)

# Set up Edges
workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "respond")
workflow.add_edge("respond", "persist_episodic")
workflow.add_edge("persist_episodic", "persist_semantic")
workflow.add_edge("persist_semantic", END)

# Compile the final agent
agent_executor = workflow.compile()
