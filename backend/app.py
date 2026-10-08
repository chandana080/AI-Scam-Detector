from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from detector import analyze_message

app = FastAPI(title="AI Scam Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "AI Scam Detector Backend is running!"}

@app.post("/predict")
def predict(message: Message):
    return analyze_message(message.text)