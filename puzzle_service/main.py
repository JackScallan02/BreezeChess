from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import chesspuzzlekit as cpk
import os

# Pydantic model for request body validation
class ProcessRequest(BaseModel):
    filters: dict
    count: int

app = FastAPI()

@app.get("/")
def read_root():
    """ A simple health-check endpoint. """
    return {"status": "Python service is running"}

@app.post("/getPuzzles")
async def get_puzzles(request: ProcessRequest):
    """
    This is the main endpoint the Node.js server will call.
    It receives filters and a count, and returns corresponding puzzles.
    """
    try:
        filters = request.filters
        count = request.count
        themes = None
        print(filters)
        if filters:
            if filters['themes']:
                themes = filters['themes']
        print(f"Received filters: {filters}, count: {count}")
        
        # You can access environment variables passed from docker-compose
        db_user = os.getenv("POSTGRES_USER")
        db_password = os.getenv("POSTGRES_PASSWORD")
        db_host = os.getenv("POSTGRES_HOST")
        db_port = "5432"
        db_name = os.getenv("POSTGRES_DB")

        connectionStr = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        cpk.initialize_connection(connectionStr)

        puzzles = cpk.get_puzzle(themes=themes, count=count)
        print(f"Retrieved {len(puzzles)} puzzles")

        return {
            "success": True,
            "input_received": request.dict(),
            "result": puzzles,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

