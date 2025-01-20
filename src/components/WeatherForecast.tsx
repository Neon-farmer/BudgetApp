import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

const WeatherForecast = () => {
  const { callApi, loading, error } = useApi();
  type WeatherForecast = {
    date: string; // Date in ISO format
    temperatureC: number;
    temperatureF: number;
    summary: string;
  };

  const [data, setData] = useState<WeatherForecast[] | null>(null); // Array of WeatherForecast objects or null

  const [hasFetched, setHasFetched] = useState(false); // Track if the data has already been fetched

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (hasFetched) return; // Prevent multiple fetches if already fetched

        const result = await callApi(
          "https://budgetapi.runasp.net/WeatherForecast"
        );
        setData(result);
        setHasFetched(true); // Mark as fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!loading && !hasFetched) {
      fetchWeather();
    }
  }, [callApi, loading, hasFetched]); // Dependency on hasFetched to prevent repeated fetches

  if (loading || data === null) return <div>Loading...</div>; // Ensure "Loading..." is displayed when data is null or loading is true
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Weather Forecast</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default WeatherForecast;
