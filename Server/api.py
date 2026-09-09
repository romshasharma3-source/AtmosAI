import os
import requests

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")


if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from .env")

if not WEATHER_API_KEY:
    raise ValueError("WEATHER_API_KEY is missing from .env")


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)

MODEL = "gemini-3.1-flash-lite"


# ============================================================
# REAL-TIME WEATHER FUNCTION
# ============================================================

def get_weather(city: str) -> dict:
    """
    Get current real-time weather information for a city.

    Args:
        city: Name of the city or location.
              Example: Bhopal, Mumbai, London, Tokyo.

    Returns:
        Dictionary containing current weather information.
    """

    print(f"\n🔧 WEATHER TOOL CALLED")
    print(f"📍 Location: {city}")

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        weather_data = {
            "location": f"{data['name']}, {data['sys']['country']}",
            "temperature_c": data["main"]["temp"],
            "feels_like_c": data["main"]["feels_like"],
            "humidity_percent": data["main"]["humidity"],
            "pressure_hpa": data["main"]["pressure"],
            "wind_speed_mps": data["wind"]["speed"],
            "condition": data["weather"][0]["description"]
        }

        print("✅ REAL-TIME WEATHER DATA RECEIVED")

        return weather_data

    except requests.exceptions.HTTPError:

        print("❌ Location not found")

        return {
            "error": (
                f"Could not find weather for '{city}'. "
                "Please check the city name."
            )
        }

    except requests.exceptions.RequestException as e:

        print("❌ Weather API error")

        return {
            "error": f"Weather API error: {str(e)}"
        }

    except Exception as e:

        print("❌ Unexpected weather error")

        return {
            "error": f"Unexpected error: {str(e)}"
        }


# ============================================================
# GEMINI WEATHER ASSISTANT
# ============================================================

def ask_weather(user_question: str) -> str:
    """
    Send a weather question to Gemini.

    Gemini automatically decides to call get_weather()
    and uses the returned real-time weather information
    to create the final response.
    """

    print("\n🤖 Sending question to Gemini...")
    print(f"❓ Question: {user_question}")

    try:

        response = client.models.generate_content(

            model=MODEL,

            contents=user_question,

            config=types.GenerateContentConfig(

                # ------------------------------------------------
                # GIVE GEMINI OUR PYTHON WEATHER FUNCTION
                # ------------------------------------------------

                tools=[get_weather],

                # ------------------------------------------------
                # SYSTEM INSTRUCTION
                # ------------------------------------------------

                system_instruction="""
You are a real-time weather assistant.

Your job is to provide CURRENT weather information.

IMPORTANT:

Whenever the user asks about:

- current weather
- temperature
- today's weather
- humidity
- wind
- weather condition
- rain
- how hot or cold a place is
- feels-like temperature

you MUST use the get_weather function.

NEVER guess or invent weather information.

Extract the city or location from the user's question
and send it to get_weather.

Examples:

User:
What is the temperature in Bhopal?

Call:
get_weather("Bhopal")


User:
What is the weather in London?

Call:
get_weather("London")


User:
How hot is Dubai?

Call:
get_weather("Dubai")


User:
What's the weather in New York?

Call:
get_weather("New York")


User:
Temperature in Tokyo Japan

Call:
get_weather("Tokyo, Japan")


After receiving the weather tool result:

Give the user a short and friendly answer.

Include:

Location
Current temperature in °C
Feels-like temperature
Weather condition
Humidity
Wind speed

Do not invent or modify weather values.

Clearly indicate that the information is current
weather data obtained from the weather tool.
"""
            )
        )

        print("✅ Gemini response received")

        return response.text

    except Exception as e:

        print("❌ Gemini error:")
        print(e)

        raise Exception(
            f"Gemini weather assistant error: {str(e)}"
        )


# ============================================================
# SIMPLE TEST
# ============================================================

if __name__ == "__main__":

    print("\n🌤️ REAL-TIME WEATHER AI")
    print("========================")

    question = input(
        "Ask a weather question: "
    )

    answer = ask_weather(question)

    print("\n🌤️ Weather Assistant:")
    print(answer)