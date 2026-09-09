import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from api import ask_weather


# ============================================================
# CONFIGURATION
# ============================================================

APP_ENV = os.getenv("APP_ENV", "production")

# Exact production Vercel frontend
PRODUCTION_FRONTEND = "https://atmos-ai-woad.vercel.app"

# Local development URLs
LOCAL_FRONTENDS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Additional origins from Render environment variable
ENV_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

# Combine all allowed origins
ALLOWED_ORIGINS = list(
    dict.fromkeys(
        [
            PRODUCTION_FRONTEND,
            *ENV_ORIGINS,
            *(
                LOCAL_FRONTENDS
                if APP_ENV == "development"
                else []
            ),
        ]
    )
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AtmosAI Weather API",
    description=(
        "Real-time weather information powered by "
        "Gemini and OpenWeatherMap."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    # Explicit production + local origins
    allow_origins=ALLOWED_ORIGINS,

    # Also allow Vercel preview deployments
    allow_origin_regex=r"https://.*\.vercel\.app",

    # No cookies/authentication are being used by this API
    allow_credentials=False,

    # Allow normal API methods and browser preflight
    allow_methods=["GET", "POST", "OPTIONS"],

    # Allow JSON and browser headers
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class WeatherRequest(BaseModel):
    city: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="City name, e.g. Bhopal or London",
    )


class WeatherQuestion(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Natural-language weather question",
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def home():
    return {
        "name": "AtmosAI Weather API",
        "status": "running",
        "version": "1.0.0",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AtmosAI Weather API",
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
            detail="City name cannot be empty.",
        )

    try:
        question = f"What is the current weather in {city}?"

        answer = ask_weather(question)

        return {
            "status": "success",
            "city": city,
            "answer": answer,
        }

    except Exception as e:
        print(f"Weather error: {e}")

        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve weather information right now.",
        )


# ============================================================
# AI WEATHER QUESTION ENDPOINT
# ============================================================

@app.post("/ask")
def ask_question(request: WeatherQuestion):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:
        answer = ask_weather(question)

        return {
            "status": "success",
            "question": question,
            "answer": answer,
        }

    except Exception as e:
        print(f"AI weather error: {e}")

        raise HTTPException(
            status_code=502,
            detail="Unable to process the weather request right now.",
        )