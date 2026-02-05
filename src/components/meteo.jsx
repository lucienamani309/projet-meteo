import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { WiHumidity, WiStrongWind, WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

export default function WeatherCard() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherIcon = (code) => {
    if (code === 0) return <WiDaySunny className="text-5xl" />;
    if (code <= 3) return <WiCloudy className="text-5xl" />;
    if (code <= 48) return <WiFog className="text-5xl" />;
    if (code <= 67) return <WiRain className="text-5xl" />;
    if (code <= 77) return <WiSnow className="text-5xl" />;
    return <WiThunderstorm className="text-5xl" />;
  };

  const fetchWeather = async () => {
    if (!search) return;

    try {
      setLoading(true);
      setError("");

      // 🌍 Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=1&language=fr`
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        throw new Error("Ville introuvable");
      }

      const { latitude, longitude, name } = geoData.results[0];

      // ☀️ Weather + humidity
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
      );
      const data = await weatherRes.json();

      const currentHour = new Date().getHours();
      const humidity = data.hourly.relativehumidity_2m[currentHour];

      setWeather({
        city: name,
        temperature: Math.round(data.current_weather.temperature),
        windSpeed: data.current_weather.windspeed,
        humidity,
        weatherCode: data.current_weather.weathercode,
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

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-200">{error}</p>}

        {weather && (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6 text-yellow-300">
              {getWeatherIcon(weather.weatherCode)}
            </div>

            {/* Temperature */}
            <div className="text-center">
              <h1 className="text-6xl font-light">
                {weather.temperature}
                <span className="text-3xl align-top">°C</span>
              </h1>
              <p className="text-xl font-medium mt-2">{weather.city}</p>
            </div>

            <div className="my-6 border-t border-white/30"></div>

            {/* Details */}
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <WiHumidity className="text-3xl" />
                <div>
                  <p className="font-semibold">{weather.humidity}%</p>
                  <p className="text-white/70 text-xs">Humidity</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <WiStrongWind className="text-3xl" />
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
