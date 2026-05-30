import { useState } from 'react'
import { CloudSun, Droplets, Wind, Thermometer, Leaf, RefreshCw, CloudRain, CloudSunRain, Sun, Cloud, Sprout, FlaskConical, MapPin } from 'lucide-react'

const weatherData = {
  city: 'Pune',
  temp: 32,
  feels: 35,
  humidity: 62,
  wind: 14,
  description: 'Partly Cloudy',
  icon: CloudSun,
  forecast: [
    { day: 'Today', icon: CloudSun, high: 32, low: 24, rain: '20%' },
    { day: 'Tue', icon: CloudRain, high: 28, low: 22, rain: '70%' },
    { day: 'Wed', icon: CloudSunRain, high: 29, low: 23, rain: '50%' },
    { day: 'Thu', icon: Sun, high: 34, low: 25, rain: '5%' },
    { day: 'Fri', icon: CloudSun, high: 31, low: 23, rain: '15%' },
  ],
}

const cropSuggestions = [
  { crop: 'Sugarcane', icon: Sprout, season: 'Kharif', confidence: 92, reason: 'High humidity + warm temps ideal' },
  { crop: 'Soybean', icon: Sprout, season: 'Kharif', confidence: 85, reason: 'Well-drained soil + monsoon timing' },
  { crop: 'Cotton', icon: Leaf, season: 'Kharif', confidence: 78, reason: 'Good temperature range for growth' },
  { crop: 'Onion', icon: Sprout, season: 'Rabi', confidence: 71, reason: 'Plan ahead for Rabi season' },
]

const fertilizerRecs = [
  { product: 'DAP (18-46-0)', type: 'Fertilizer', reason: 'Pre-sowing phosphorus boost', priority: 'High' },
  { product: 'Urea 46%', type: 'Fertilizer', reason: 'Nitrogen top dressing at 30 DAS', priority: 'High' },
  { product: 'Potassium Sulfate', type: 'Fertilizer', reason: 'Improves drought tolerance', priority: 'Medium' },
  { product: 'Chlorpyrifos', type: 'Pesticide', reason: 'Soil pest prevention before sowing', priority: 'Low' },
]

const priorityColor = { High: 'red', Medium: 'orange', Low: 'blue' }

export default function Weather() {
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  const CurrentWeatherIcon = weatherData.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Weather & Crop Advisory</h1>
          <p className="text-sm text-gray-500">Seasonal recommendations for {weatherData.city}</p>
        </div>
        <button onClick={refresh} disabled={loading} className="btn-secondary text-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Weather */}
        <div className="lg:col-span-1" style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)', borderRadius: '1rem', padding: '1.5rem', color: 'white' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm opacity-70 flex items-center gap-1">
                <MapPin size={14} className="text-white" /> {weatherData.city}, Maharashtra
              </p>
              <p className="text-5xl font-bold mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{weatherData.temp}°C</p>
              <p className="text-lg opacity-80 mt-1">{weatherData.description}</p>
            </div>
            <span className="text-7xl">
              <CurrentWeatherIcon size={64} className="text-white" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Thermometer size={16} className="mx-auto mb-1 opacity-70" />
              <p className="text-xs opacity-70">Feels</p>
              <p className="font-bold text-sm">{weatherData.feels}°C</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Droplets size={16} className="mx-auto mb-1 opacity-70" />
              <p className="text-xs opacity-70">Humidity</p>
              <p className="font-bold text-sm">{weatherData.humidity}%</p>
            </div>
            <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Wind size={16} className="mx-auto mb-1 opacity-70" />
              <p className="text-xs opacity-70">Wind</p>
              <p className="font-bold text-sm">{weatherData.wind} km/h</p>
            </div>
          </div>

          {/* 5-day forecast */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs opacity-60 mb-3">5-Day Forecast</p>
            <div className="grid grid-cols-5 gap-1">
              {weatherData.forecast.map((f) => {
                const ForecastIcon = f.icon;
                return (
                  <div key={f.day} className="text-center flex flex-col items-center">
                    <p className="text-xs opacity-60">{f.day}</p>
                    <div className="my-2">
                      <ForecastIcon size={20} className="text-white" />
                    </div>
                    <p className="text-xs font-bold">{f.high}°</p>
                    <p className="text-xs opacity-50">{f.low}°</p>
                    <p className="text-xs opacity-60 mt-1">{f.rain}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Crop Suggestions */}
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <Leaf size={18} className="text-green-600" /> Crop Recommendations
          </h3>
          <div className="space-y-3">
            {cropSuggestions.map((c) => {
              const CropIcon = c.icon;
              return (
                <div key={c.crop} className="p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <CropIcon size={24} className="text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{c.crop}</p>
                        <p className="text-xs text-gray-400">{c.season} Season</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-700">{c.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-green-200 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${c.confidence}%`, background: '#2E7D32' }} />
                  </div>
                  <p className="text-xs text-gray-500">{c.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fertilizer Recommendations */}
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <FlaskConical size={18} className="text-green-600" /> Product Recommendations
          </h3>
          <div className="space-y-3">
            {fertilizerRecs.map((r) => (
              <div key={r.product} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{r.product}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.reason}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      background: r.priority === 'High' ? '#fef2f2' : r.priority === 'Medium' ? '#fff7ed' : '#eff6ff',
                      color: r.priority === 'High' ? '#dc2626' : r.priority === 'Medium' ? '#c2410c' : '#1d4ed8',
                    }}>
                    {r.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            * Requires OpenWeatherMap API key for live data
          </p>
        </div>
      </div>
    </div>
  )
}
