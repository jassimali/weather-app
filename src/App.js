import React, { useEffect, useState } from "react";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import UnitToggle from "./components/UnitToggle";
import ScratchCard from "./components/ScratchCard";

const API_KEY = "9075ef6a390f76155b54e6b1c9b0977d";

function App() {
  // ---------- State ----------

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [unit, setUnit] = useState("metric"); // "metric" = °C, "imperial" = °F
  const [error, setError] = useState("");

  const [theme, setTheme] = useState("day"); // "day" or "night"

  const [secretInput, setSecretInput] = useState("");
  const [secretMessage, setSecretMessage] = useState("");

  // ---------- Helpers ----------

  const hasApiKey = Boolean(API_KEY);

  const ensureApiKey = () => {
    if (!hasApiKey) {
      setError("Missing API key. Set REACT_APP_OPENWEATHER_API_KEY in .env.");
      return false;
    }
    return true;
  };

  // "City, State, Country"
  const formatCityLabel = (cityObj) => {
    const parts = [cityObj.name];
    if (cityObj.state) parts.push(cityObj.state);
    if (cityObj.country) parts.push(cityObj.country);
    return parts.join(", ");
  };

  // ---------- Theme ----------

  useEffect(() => {
    const saved = localStorage.getItem("weather-theme");
    if (saved === "day" || saved === "night") {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove("day-theme", "night-theme");
    document.body.classList.add(theme === "day" ? "day-theme" : "night-theme");
    localStorage.setItem("weather-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "day" ? "night" : "day"));
  };

  // ---------- City suggestions ----------

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2 || !hasApiKey) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            q
          )}&limit=5&appid=${API_KEY}`
        );

        if (!res.ok) throw new Error("Failed to fetch city suggestions");

        const data = await res.json();

        if (!cancelled) {
          const mapped = data.map((item) => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
          }));
          setSuggestions(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, hasApiKey]);

  // ---------- Weather fetching ----------

  const fetchWeather = async (lat, lon, cityLabel) => {
    if (!ensureApiKey()) return;

    setLoadingWeather(true);
    setError("");
    setWeatherData(null);

    try {
      // Always metric; we convert in UI
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await res.json();

      setWeatherData({
        cityLabel,
        tempC: data.main.temp,
        feelsLikeC: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeedMs: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load weather");
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleSelectCity = (cityObj) => {
    const label = formatCityLabel(cityObj);
    setSearchQuery(label);
    setSuggestions([]);
    fetchWeather(cityObj.lat, cityObj.lon, label);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setError("Please enter a city name");
      return;
    }
    if (!ensureApiKey()) return;

    setError("");
    setLoadingWeather(true);
    setWeatherData(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          q
        )}&limit=1&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("Failed to find city");

      const data = await res.json();

      if (!data || data.length === 0) {
        throw new Error("City not found");
      }

      const cityObj = {
        name: data[0].name,
        state: data[0].state,
        country: data[0].country,
        lat: data[0].lat,
        lon: data[0].lon,
      };

      const label = formatCityLabel(cityObj);
      setSearchQuery(label);
      await fetchWeather(cityObj.lat, cityObj.lon, label);
    } catch (err) {
      console.error(err);
      setError(err.message || "City not found");
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
  };

  // ---------- Secret input + scratch logic ----------

  const handleSecretInputChange = (e) => {
    const value = e.target.value;
    setSecretInput(value);

    // If user clears manually, hide message immediately
    if (value.trim() === "") {
      setSecretMessage("");
    }
  };

  const handleSecretSubmit = () => {
    const text = secretInput.trim().toLowerCase();

    if (!text) {
      setSecretMessage("");
      return;
    }

    if (text === "280828") {
      // special code → scratch card
      setSecretMessage("nte innutyaaattoooooo 😙");
    } else {
      // normal message
      setSecretMessage("Happy Hacking!!!!");
    }
  };

  const handleSecretClear = () => {
    setSecretInput("");
    setSecretMessage("");
  };

  const isSecretCode = secretInput.trim().toLowerCase() === "280828";

  // ---------- Render ----------

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="title">Weather Explorer</h1>
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === "day" ? "🌙 Night mode" : "🌞 Day mode"}
        </button>
      </div>

      <CitySearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmit={handleSearchSubmit}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectCity}
        loadingSuggestions={loadingSuggestions}
      />

      <UnitToggle unit={unit} onToggle={handleUnitToggle} />

      {error && <p className="error">{error}</p>}
      {loadingWeather && <p className="info">Loading weather...</p>}

      {weatherData && (
        <>
          <WeatherCard weather={weatherData} unit={unit} />

          <div className="secret-box">
            <input
              type="text"
              className="secret-input"
              placeholder="Type Here"
              value={secretInput}
              onChange={handleSecretInputChange}
            />

            <div className="secret-actions">
              <button className="secret-btn" onClick={handleSecretSubmit}>
                Submit
              </button>
              <button className="secret-btn" onClick={handleSecretClear}>
                Clear
              </button>
            </div>

            {secretMessage && (
              <>
                {isSecretCode ? (
                  <div className="scratch-wrapper">
                    <p className="scratch-hint">Scratch here 👇</p>
                    <ScratchCard message={secretMessage} />
                  </div>
                ) : (
                  <p className="secret-message">{secretMessage}</p>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
