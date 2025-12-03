import React from "react";

function formatTemperature(tempC, unit) {
  if (tempC == null) return "";
  if (unit === "metric") {
    return `${Math.round(tempC)}°C`;
  } else {
    const tempF = (tempC * 9) / 5 + 32;
    return `${Math.round(tempF)}°F`;
  }
}

function formatWindSpeed(speedMs, unit) {
  if (speedMs == null) return "";
  if (unit === "metric") {
    return `${speedMs.toFixed(1)} m/s`;
  } else {
    const mph = speedMs * 2.23694;
    return `${mph.toFixed(1)} mph`;
  }
}

function WeatherCard({ weather, unit }) {
  const {
    cityLabel,
    tempC,
    feelsLikeC,
    humidity,
    windSpeedMs,
    description,
    icon,
  } = weather;

  return (
    <div className="card">
      <h2 className="city-label">{cityLabel}</h2>

      <div className="temp-row">
        {icon && (
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
          />
        )}
        <div>
          <p className="temp-main">{formatTemperature(tempC, unit)}</p>
          <p className="desc">{description}</p>
        </div>
      </div>

      <div className="details">
        <p>
          <span className="label">Feels like:</span>{" "}
          {formatTemperature(feelsLikeC, unit)}
        </p>
        <p>
          <span className="label">Humidity:</span> {humidity}%
        </p>
        <p>
          <span className="label">Wind:</span> {formatWindSpeed(windSpeedMs, unit)}
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
