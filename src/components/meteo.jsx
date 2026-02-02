import { useState } from "react";
import { FiSearch, FiSun } from "react-icons/fi";
import { WiHumidity, WiStrongWind } from "react-icons/wi";

export default function WeatherCard() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!search) return;

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Geocoding : ville → latitude / longitude
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=1&language=fr`
      );

      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Ville introuvable");
      }

      const { latitude, longitude, name } = geoData.results[0];

      // 2️⃣ Weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        temperature: Math.round(weatherData.current_weather.temperature),
        windSpeed: weatherData.current_weather.windspeed,
        humidity: "--", // Open-Meteo ne fournit pas l'humidité dans current_weather
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl p-6 text-white">

        {/* Search */}
        <div className="flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 outline-none placeholder-white/70 text-sm"
          />
          <button onClick={fetchWeather}>
            <FiSearch className="text-lg" />
          </button>
        </div>

        {/* States */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-200">{error}</p>}

        {weather && (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <FiSun className="text-white text-4xl" />
              </div>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <h1 className="text-6xl font-light">
                {weather.temperature}
                <span className="text-3xl align-top">°C</span>
              </h1>
              <p className="text-xl font-medium mt-2">{weather.city}</p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/30"></div>

            {/* Details */}
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <WiHumidity className="text-3xl text-white/90" />
                <div>
                  <p className="font-semibold">{weather.humidity}</p>
                  <p className="text-white/70 text-xs">Humidity</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <WiStrongWind className="text-3xl text-white/90" />
                <div>
                  <p className="font-semibold">{weather.windSpeed} km/h</p>
                  <p className="text-white/70 text-xs">Wind Speed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
