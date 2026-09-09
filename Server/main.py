from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api import ask_weather


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(

    title="Weather AI Assistant API",

    description=(
        "Real-time Weather API powered by "
        "Gemini and OpenWeatherMap"
    ),

    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class WeatherRequest(BaseModel):

    city: str


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {

        "message": "Weather AI Assistant API is running",

        "status": "success",

        "version": "1.0.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {

        "status": "healthy",

        "service": "Weather AI Assistant"
    }


# ============================================================
# WEATHER ENDPOINT
# ============================================================

@app.post("/weather")
def weather(request: WeatherRequest):

    city = request.city.strip()

    if not city:

        raise HTTPException(

            status_code=400,

            detail="City name cannot be empty."
        )


    try:

        # --------------------------------------------
        # Send the question to Gemini
        # --------------------------------------------

        question = (
            f"What is the current weather in {city}?"
        )

        answer = ask_weather(question)


        # --------------------------------------------
        # Return API response
        # --------------------------------------------

        return {

            "status": "success",

            "city": city,

            "answer": answer
        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# ============================================================
# WEATHER QUESTION ENDPOINT
# ============================================================

class WeatherQuestion(BaseModel):

    question: str


@app.post("/ask")
def ask_question(request: WeatherQuestion):

    question = request.question.strip()

    if not question:

        raise HTTPException(

            status_code=400,

            detail="Question cannot be empty."
        )


    try:

        answer = ask_weather(question)

        return {

            "status": "success",

            "question": question,

            "answer": answer
        }


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# ============================================================
# SERVER START MESSAGE
# ============================================================

@app.on_event("startup")
def startup_event():

    print()
    print("==============================================")
    print("🌤️  WEATHER AI ASSISTANT API")
    print("==============================================")
    print("🚀 FastAPI server starting...")
    print("🤖 Gemini: gemini-3.1-flash-lite")
    print("🌍 Weather: OpenWeatherMap")
    print("==============================================")