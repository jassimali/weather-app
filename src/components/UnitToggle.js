import React from "react";

function UnitToggle({ unit, onToggle }) {
  return (
    <div className="unit-toggle">
      <button
        type="button"
        className={unit === "metric" ? "active" : ""}
        onClick={() => onToggle("metric")}
      >
        °C
      </button>
      <span className="divider">/</span>
      <button
        type="button"
        className={unit === "imperial" ? "active" : ""}
        onClick={() => onToggle("imperial")}
      >
        °F
      </button>
    </div>
  );
}

export default UnitToggle;
