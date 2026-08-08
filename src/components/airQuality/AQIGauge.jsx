export default function AQIGauge({ weather }) {
  if (!weather) {
    return null;
  }

  // Simulated AQI based on weather conditions
  const getAQI = () => {
    const windSpeed = weather.wind?.speed || 0;
    const humidity = weather.main?.humidity || 50;
    const cloudiness = weather.clouds?.all || 0;

    // Simple estimation: lower wind and higher humidity = worse air quality
    const baseAQI = 30;
    const windFactor = (10 - Math.min(windSpeed, 10)) * 3;
    const humidityFactor = humidity > 70 ? (humidity - 70) * 0.5 : 0;
    const cloudFactor = cloudiness > 50 ? (cloudiness - 50) * 0.2 : 0;

    return Math.min(
      500,
      Math.max(
        0,
        Math.round(baseAQI + windFactor + humidityFactor + cloudFactor),
      ),
    );
  };

  const aqi = getAQI();
  const getAQIInfo = (value) => {
    if (value <= 50)
      return { level: "Good", color: "#22c55e", bgColor: "bg-green-500" };
    if (value <= 100)
      return { level: "Moderate", color: "#eab308", bgColor: "bg-yellow-500" };
    if (value <= 150)
      return {
        level: "Unhealthy for Sensitive Groups",
        color: "#f97316",
        bgColor: "bg-orange-500",
      };
    if (value <= 200)
      return { level: "Unhealthy", color: "#ef4444", bgColor: "bg-red-500" };
    if (value <= 300)
      return {
        level: "Very Unhealthy",
        color: "#a855f7",
        bgColor: "bg-purple-500",
      };
    return { level: "Hazardous", color: "#7c3aed", bgColor: "bg-purple-700" };
  };

  const { level, color } = getAQIInfo(aqi);
  const percentage = Math.min(100, (aqi / 500) * 100);

  return (
    <div className="rounded-3xl bg-slate-950/90 p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-slate-400">Air Quality Index</p>

      <div className="mt-4 flex items-center gap-4 sm:gap-6">
        <div className="relative h-24 w-24 sm:h-32 sm:w-32">
          <svg
            className="h-full w-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
            />

            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.51} 251`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {aqi}
            </span>
          </div>
        </div>

        <div>
          <p className={`text-xl sm:text-2xl font-semibold`} style={{ color }}>
            {level}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {aqi <= 50
              ? "Air quality is satisfactory."
              : aqi <= 100
                ? "Acceptable air quality for most people."
                : aqi <= 150
                  ? "Sensitive groups should reduce outdoor activity."
                  : aqi <= 200
                    ? "Everyone may begin to experience health effects."
                    : aqi <= 300
                      ? "Health alert: everyone may experience more serious health effects."
                      : "Health warning of emergency conditions."}
          </p>
        </div>
      </div>

      {/* AQI Scale */}
      <div className="mt-4 sm:mt-6 flex h-2 rounded-full overflow-hidden">
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-yellow-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-purple-500" />
        <div className="flex-1 bg-purple-700" />
      </div>
      <div className="mt-2 flex justify-between text-[10px] sm:text-xs font-bold" style={{ color: "#ffffff" }}>
        <span>0 Good</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>300</span>
        <span>500+ Hazards</span>
      </div>
    </div>
  );
}
