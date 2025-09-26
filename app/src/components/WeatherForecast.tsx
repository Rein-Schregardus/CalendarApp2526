import { useEffect, useState } from "react";
import { fetchHelper } from "../helpers/fetchHelper.ts";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export function Weather() {
  const [data, setData] = useState<WeatherForecast[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHelper("/WeatherForecast")
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {data.map((w) => (
        <li key={w.date}>
          {w.date}: {w.summary} ({w.temperatureC}°C / {w.temperatureF}°F)
        </li>
      ))}
    </ul>
  );
}

export default Weather;