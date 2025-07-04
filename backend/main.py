from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import uuid
import requests

app = FastAPI(title="Weather Data System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class   WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str

@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    response = requests.get(
        "http://api.weatherstack.com/current",
        params={
            "access_key": "fb7d886fcfc63ff3ee17b045e0db60e7",
            "query": request.location
        },
        timeout=10
    )
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Unintended WeatherStack behaviour")
    
    unique_id = str(uuid.uuid1())
    weather_storage[unique_id] = {
        "id": unique_id,
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": response.json()["current"]
    }

    #weather_storage[unique_id] = request.dict()
    return WeatherResponse(id=unique_id)
    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """

@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)