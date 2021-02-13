import { useEffect, useState } from "react";
import { ForecastData } from "../api/defs";
import fetchForecast from "../api/forecast";

function useForecast(slug: string, start: string, end: string) {
  const [forecast, setForecast] = useState<ForecastData[]>();

  useEffect(() => {
    const fetcher = async () => {
      fetchForecast(slug, start, end).then((f) => f && setForecast(f));
    };

    fetcher();
  }, [slug, start, end]);

  return forecast;
}

export default useForecast;
