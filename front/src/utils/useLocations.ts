import { useEffect, useState } from "react";
import { LocationData } from "../api/defs";
import fetchLocations from "../api/locations";

function useLocations() {
  const [locations, setLocations] = useState<LocationData[]>();

  useEffect(() => {
    const fetcher = async () => {
      fetchLocations().then((l) => l && setLocations(l));
    };

    fetcher();
  }, []);

  return locations;
}

export default useLocations;
