import { apiBase, LocationData } from "./defs";

const fetchForecast = async (): Promise<LocationData[] | void> => {
  const endPoint = `${apiBase}/locations`;

  try {
    const res = await fetch(endPoint);
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
