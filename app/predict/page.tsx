'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- TYPES ---
interface WeatherResult {
  temperature: number;
  humidity: number;
  wind_speed: number;
  is_raining: boolean;
  storm_alert: boolean;
}

interface FormDataState {
  Summary_Code: number;
  Hour: number;
  Month: number;
  Temp_Lag_1: number;
  Humidity_Lag_1: number;
  Wind_Lag_1: number;
  Rain_Code_Lag_1: number;
  Temp_Lag_24: number;
  Humidity_Lag_24: number;
  Wind_Lag_24: number;
  Rain_Code_Lag_24: number;
}

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingCity, setFetchingCity] = useState(false);
  const [city, setCity] = useState("Mumbai");
  const [result, setResult] = useState<WeatherResult | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState<FormDataState>({
    Summary_Code: 2,
    Hour: new Date().getHours(),
    Month: new Date().getMonth() + 1,
    Temp_Lag_1: 25.0,
    Humidity_Lag_1: 0.85,
    Wind_Lag_1: 10.0,
    Rain_Code_Lag_1: 0,
    Temp_Lag_24: 24.0,
    Humidity_Lag_24: 0.80,
    Wind_Lag_24: 12.0,
    Rain_Code_Lag_24: 0
  });

  // --- HANDLERS ---
  
  // 1. Generic Change Handler for Number Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value), // Convert string input to number
    }));
  };

  const mapWmoToSummary = (wmoCode: number) => {
    if (wmoCode === 0) return 0; // Clear
    if (wmoCode <= 3) return 1; // Partly Cloudy
    if (wmoCode >= 45 && wmoCode <= 48) return 3; // Fog
    return 2; // Overcast
  };

  const mapWmoToRain = (wmoCode: number) => {
    return wmoCode > 50 ? 1 : 0;
  };

  // --- AUTO FILL LOGIC ---
  const handleAutoFill = async () => {
    setFetchingCity(true);
    setResult(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!");
        setFetchingCity(false);
        return;
      }
      
      const { latitude, longitude, name, country } = geoData.results[0];
      setCity(`${name}, ${country}`);

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=2&forecast_days=1&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&current_weather=true&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const wData = await weatherRes.json();

      const targetTime = new Date(wData.current_weather.time).getTime();
      let currentIndex = 0;
      let minDiff = Infinity;
      
      wData.hourly.time.forEach((t: string, index: number) => {
        const diff = Math.abs(new Date(t).getTime() - targetTime);
        if (diff < minDiff) { 
          minDiff = diff; 
          currentIndex = index; 
        }
      });

      const idx1 = Math.max(0, currentIndex - 1);
      const idx24 = Math.max(0, currentIndex - 24);

      setFormData({
        Hour: new Date(wData.current_weather.time).getHours(),
        Month: new Date(wData.current_weather.time).getMonth() + 1,
        Summary_Code: mapWmoToSummary(wData.current_weather.weathercode),
        
        Temp_Lag_1: wData.hourly.temperature_2m[idx1],
        Humidity_Lag_1: wData.hourly.relative_humidity_2m[idx1] / 100,
        Wind_Lag_1: wData.hourly.wind_speed_10m[idx1],
        Rain_Code_Lag_1: mapWmoToRain(wData.hourly.weather_code[idx1]),
        
        Temp_Lag_24: wData.hourly.temperature_2m[idx24],
        Humidity_Lag_24: wData.hourly.relative_humidity_2m[idx24] / 100,
        Wind_Lag_24: wData.hourly.wind_speed_10m[idx24],
        Rain_Code_Lag_24: mapWmoToRain(wData.hourly.weather_code[idx24]),
      });

    } catch (err) {
      console.error(err);
      alert("Error fetching data.");
    } finally {
      setFetchingCity(false);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Backend Error");
      const data: WeatherResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  // Style for editable inputs to look inviting
  const inputStyle = "w-full bg-slate-700 rounded-lg p-2 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelStyle = "text-[10px] text-slate-400 font-bold uppercase mb-1 block";

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center font-sans">
      
      <nav className="w-full max-w-6xl mb-8 flex justify-between items-center border-b border-slate-700 pb-4">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-black bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          AI Weather Oracle ⛈️
        </h1>
        <div className="w-24"></div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        
        {/* LEFT PANEL: INPUT FORM */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 w-full lg:w-1/2">
          
          {/* Auto-Fill */}
          <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-blue-500/30">
            <label className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-2 block">
              📍 1. Select Location (Auto-Fill)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAutoFill()}
                className="flex-1 bg-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Mumbai"
              />
              <button 
                onClick={handleAutoFill}
                disabled={fetchingCity}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {fetchingCity ? <span className="animate-spin">↻</span> : "Fetch"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* General Context */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelStyle}>Hour (0-23)</label>
                <input type="number" name="Hour" value={formData.Hour} onChange={handleInputChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Month (1-12)</label>
                <input type="number" name="Month" value={formData.Month} onChange={handleInputChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Sky Condition</label>
                <select name="Summary_Code" value={formData.Summary_Code} onChange={handleInputChange} className={inputStyle}>
                  <option value={0}>Clear</option>
                  <option value={1}>Partly Cloudy</option>
                  <option value={2}>Overcast</option>
                  <option value={3}>Foggy</option>
                </select>
              </div>
            </div>

            {/* 1 Hour Ago (Editable) */}
            <div className="bg-slate-700/20 p-3 rounded-lg border border-slate-700">
              <h3 className="text-xs font-bold text-blue-300 mb-2">⏱️ 1 Hour Ago (Trending)</h3>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className={labelStyle}>Temp (°C)</label>
                  <input type="number" name="Temp_Lag_1" value={formData.Temp_Lag_1} onChange={handleInputChange} className={inputStyle} step="0.1" />
                </div>
                <div>
                  <label className={labelStyle}>Humid (0-1)</label>
                  <input type="number" name="Humidity_Lag_1" value={formData.Humidity_Lag_1} onChange={handleInputChange} className={inputStyle} step="0.01" max="1" min="0" />
                </div>
                <div>
                  <label className={labelStyle}>Wind (km/h)</label>
                  <input type="number" name="Wind_Lag_1" value={formData.Wind_Lag_1} onChange={handleInputChange} className={inputStyle} step="0.1" />
                </div>
                <div>
                  <label className={labelStyle}>Rain?</label>
                  <select name="Rain_Code_Lag_1" value={formData.Rain_Code_Lag_1} onChange={handleInputChange} className={inputStyle}>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 24 Hours Ago (Editable) */}
            <div className="bg-slate-700/20 p-3 rounded-lg border border-slate-700">
              <h3 className="text-xs font-bold text-purple-300 mb-2">📅 24 Hours Ago (Cycle)</h3>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <input type="number" name="Temp_Lag_24" value={formData.Temp_Lag_24} onChange={handleInputChange} className={inputStyle} step="0.1" />
                </div>
                <div>
                  <input type="number" name="Humidity_Lag_24" value={formData.Humidity_Lag_24} onChange={handleInputChange} className={inputStyle} step="0.01" />
                </div>
                <div>
                  <input type="number" name="Wind_Lag_24" value={formData.Wind_Lag_24} onChange={handleInputChange} className={inputStyle} step="0.1" />
                </div>
                <div>
                  <select name="Rain_Code_Lag_24" value={formData.Rain_Code_Lag_24} onChange={handleInputChange} className={inputStyle}>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? "Processing..." : "Predict Future 🚀"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full lg:w-1/2 flex flex-col justify-center items-center relative overflow-hidden min-h-[400px]">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {!result ? (
            <div className="text-center space-y-4 opacity-40">
              <div className="text-8xl animate-pulse">☁️</div>
              <p className="text-slate-400 font-medium">Ready to Forecast</p>
            </div>
          ) : (
            <div className="w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
              
              {result.storm_alert ? (
                <div className="bg-red-500/20 border-2 border-red-500 text-red-100 p-6 rounded-2xl animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <h2 className="text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                    ⚠️ STORM ALERT
                  </h2>
                  <p className="text-red-300 mt-2 font-bold">High Winds & Rain Detected</p>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-100 p-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    ✅ Conditions Stable
                  </h2>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-700/40 p-6 rounded-2xl border border-slate-600">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Temperature</p>
                  <p className="text-5xl font-black text-yellow-400 drop-shadow-lg">{result.temperature}°</p>
                </div>
                <div className="bg-slate-700/40 p-6 rounded-2xl border border-slate-600">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Wind Speed</p>
                  <p className="text-5xl font-black text-cyan-400 drop-shadow-lg">
                    {result.wind_speed} <span className="text-xl font-medium text-cyan-400/70">km/h</span>
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${result.is_raining ? "bg-blue-900/40 border-blue-400 shadow-blue-500/20 shadow-lg" : "bg-slate-700/30 border-slate-600"}`}>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl filter drop-shadow-md">{result.is_raining ? "🌧️" : "☀️"}</span>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 uppercase font-bold">Precipitation</p>
                    <span className={`text-3xl font-bold ${result.is_raining ? "text-blue-300" : "text-gray-300"}`}>
                      {result.is_raining ? "Rain Expected" : "Clear Skies"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}