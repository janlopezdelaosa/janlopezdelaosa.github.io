import { apiBase, ForecastData } from "./defs";

const fetchForecast = async (
  slug: string,
  start: string,
  end: string
): Promise<ForecastData[] | void> => {
  const endPoint = `${apiBase}/forecast`;
  const pLocation = `location=${slug}`;
  const pStart = `start=${start}`;
  const pEnd = `end=${end}`;

  try {
    const res = await fetch(`${endPoint}?${pLocation}&${pStart}&${pEnd}`);
    const data = await res.json();
    if (!res.ok) {
      console.log(data.msg);
    } else {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export default fetchForecast;
