import { useQuery } from "react-query";
import { apiBase, ForecastData } from "./defs";

function useForecast(slug: string, start: string, end: string): ForecastData[] {
  const endPoint = `${apiBase}/forecast`;
  const pLocation = `location=${slug}`;
  const pStart = `start=${start}`;
  const pEnd = `end=${end}`;

  const query = useQuery(["forecast", slug, start, end], async () => {
    const response = await fetch(`${endPoint}?${pLocation}&${pStart}&${pEnd}`);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg);
    } else {
      return response.json();
    }
  });

  return query.data;
}

export default useForecast;
