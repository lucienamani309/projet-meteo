import { useEffect, useState } from "react";
import { FiSearch, FiSun } from "react-icons/fi";
import { WiHumidity, WiStrongWind } from "react-icons/wi";

export default function WeatherCard() {
  const [weather, setWeather] = useState({
    city: "Goma",
    temperature: 9,
    humidity: 86,
    windSpeed: 1.6,
    condition: "Sunny",
  });

  useEffect(() => {
    // ===============================
    // 🔗 API CALL WILL BE HERE LATER
    // fetch("WEATHER_API_URL")
    //   .then(res => res.json())
    //   .then(data => setWeather(mappedData))
    // ===============================
  }, []);

  return (
    <div className="w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl p-6 text-white">

        {/* Search */}
        <div className="flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none placeholder-white/70 text-sm"
          />
          <FiSearch className="text-white text-lg" />
        </div>

        {/* Weather Icon */}
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
              <p className="font-semibold">{weather.humidity}%</p>
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
      </div>
    </div>
  );
}
