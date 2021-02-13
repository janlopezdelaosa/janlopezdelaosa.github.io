import { useQuery } from "react-query";
import { apiBase, LocationData } from "./defs";

function useLocations(): LocationData[] {
  const endPoint = `${apiBase}/locations`;

  const query = useQuery("locations", async () => {
    const response = await fetch(endPoint);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg);
    } else {
      return response.json();
    }
  });

  return query.data;
}

export default useLocations;
