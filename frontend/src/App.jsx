import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async (selectedCity = city) => {
    const location = selectedCity.trim();

    if (!location) {
      setError("Please enter a city to check the weather.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch("https://atmosai-ew2l.onrender.com/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "We couldn't find weather for that location."
        );
      }

      setWeather(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the weather service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getWeather();
    }
  };

  const quickSearch = (location) => {
    setCity(location);
    getWeather(location);
  };

  const clearWeather = () => {
    setWeather(null);
    setError("");
    setCity("");
  };

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-900">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      {/* =========================================================
          APP CONTAINER
      ========================================================= */}

      <div className="relative mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">

        {/* =======================================================
            HEADER
        ======================================================= */}

        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-xl text-white shadow-lg shadow-sky-200">
              ☀
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                AtmosAI
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Intelligent weather
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Live
            </span>
          </div>
        </header>

        {/* =======================================================
            HERO
        ======================================================= */}

        <section className="mx-auto max-w-5xl px-1 pb-8 pt-12 text-center sm:pt-16 lg:pt-20">

          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 shadow-sm">
            <span className="text-sm">✨</span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
              Your personal weather assistant
            </span>
          </div>

          <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-[-0.045em] text-slate-900 sm:text-6xl lg:text-7xl">
            Know your weather.
            <span className="block text-sky-500">
              Before you step out.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
            Search any city and get clear, real-time weather information
            with the help of AI.
          </p>

          {/* =====================================================
              SEARCH
          ===================================================== */}

          <div className="mx-auto mt-8 max-w-2xl">

            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">

              <div className="flex min-h-[56px] items-center gap-2">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl text-slate-400">
                  ⌖
                </div>

                <input
                  id="city"
                  type="text"
                  value={city}
                  placeholder="Search a city..."
                  onChange={(e) => {
                    setCity(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                />

                {city && (
                  <button
                    onClick={clearWeather}
                    className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

                <button
                  onClick={() => getWeather()}
                  disabled={loading}
                  className="h-11 rounded-xl bg-sky-500 px-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
                >
                  {loading ? "Checking..." : "Search"}
                </button>
              </div>
            </div>

            {/* Quick searches */}

            <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-1">

              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Popular:
              </span>

              {["Bhopal", "Mumbai", "Delhi", "London", "Tokyo"].map(
                (location) => (
                  <button
                    key={location}
                    onClick={() => quickSearch(location)}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 active:scale-95"
                  >
                    {location}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            ERROR
        ======================================================= */}

        {error && !loading && (
          <section className="mx-auto max-w-2xl">
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =======================================================
            LOADING
        ======================================================= */}

        {loading && (
          <section className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/40">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-100 border-t-sky-500" />
              </div>

              <h3 className="mt-5 text-sm font-bold text-slate-800">
                Checking the weather
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Getting the latest conditions for {city}...
              </p>
            </div>
          </section>
        )}

        {/* =======================================================
            WEATHER RESULT
        ======================================================= */}

        {weather && !loading && (
          <section className="mx-auto max-w-4xl">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

              {/* Result header */}

              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Current weather
                    </p>

                    <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {weather.city}
                    </h3>
                  </div>

                  <button
                    onClick={clearWeather}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  >
                    New search
                  </button>
                </div>
              </div>

              {/* Main weather */}

              <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">

                {/* Temperature */}

                <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 px-6 py-8 text-white sm:px-8 sm:py-10">

                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                  <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5" />

                  <div className="relative">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      Today's conditions
                    </p>

                    <div className="mt-5 flex items-center gap-5">

                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur-sm">
                        ☁
                      </div>

                      <div>
                        <div className="flex items-start">
                          <span className="text-6xl font-bold tracking-[-0.06em] sm:text-7xl">
                            --
                          </span>

                          <span className="mt-2 text-2xl font-medium">
                            °C
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-white/75">
                          Live temperature
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        AI weather summary
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white">
                        {weather.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}

                <div className="p-5 sm:p-7">

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-900">
                      Weather details
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Latest information from the weather service
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <WeatherDetail
                      icon="🌡️"
                      label="Temperature"
                      value="Live"
                    />

                    <WeatherDetail
                      icon="🌤️"
                      label="Feels like"
                      value="Live"
                    />

                    <WeatherDetail
                      icon="💧"
                      label="Humidity"
                      value="Live"
                    />

                    <WeatherDetail
                      icon="💨"
                      label="Wind"
                      value="Live"
                    />

                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        Live data
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Weather information is fetched in real time and
                      interpreted by your AI weather assistant.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  Real-time weather
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-300">
                  Gemini × OpenWeatherMap
                </span>
              </div>
            </div>
          </section>
        )}

        {/* =======================================================
            EMPTY STATE
        ======================================================= */}

        {!weather && !loading && !error && (
          <section className="mx-auto max-w-4xl">

            <div className="grid gap-4 sm:grid-cols-3">

              <FeatureCard
                icon="⚡"
                title="Real-time"
                description="Get current weather information for any city."
              />

              <FeatureCard
                icon="✦"
                title="AI powered"
                description="Receive simple, natural weather explanations."
              />

              <FeatureCard
                icon="🌍"
                title="Worldwide"
                description="Search locations across the globe in seconds."
              />

            </div>

            {/* Helpful prompt */}

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-center">

              <p className="text-xs font-semibold text-sky-800">
                Not sure where to start?
              </p>

              <p className="mt-1 text-xs text-sky-600">
                Try searching for Bhopal, Mumbai, London or Tokyo above.
              </p>

            </div>
          </section>
        )}

        {/* =======================================================
            FOOTER
        ======================================================= */}

        <footer className="px-2 py-10 text-center">

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
            AtmosAI
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Real-time weather, made simple.
          </p>
        </footer>
      </div>
    </main>
  );
}


/* ===============================================================
   WEATHER DETAIL COMPONENT
=============================================================== */

function WeatherDetail({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-100 hover:bg-sky-50/50">

      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}


/* ===============================================================
   FEATURE CARD
=============================================================== */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-lg hover:shadow-slate-200/50">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-lg text-sky-500 transition group-hover:bg-sky-100">
        {icon}
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default App;