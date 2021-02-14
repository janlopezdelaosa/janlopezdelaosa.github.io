import React, { useCallback, useEffect, useState } from "react";
import useLocations from "../api/locations";
import Search from "../svg/Search";
import Cross from "../svg/Cross";
import { LocationData } from "../api/defs";
import useDebounce from "../utils/useDebounce";
import NoData from "./NoData";

interface InputBoxProps {
  setCity: React.Dispatch<React.SetStateAction<string>>;
}

const InputBox: React.FC<InputBoxProps> = ({ setCity }) => {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 500);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const locations = useLocations();

  const searchCity = useCallback(
    (t: string, l: LocationData[]) => {
      const location = locations?.filter(
        (l) => `${l.name}, ${l.country}` === t
      )[0];
      if (location !== undefined) {
        setCity(location.slug);
        setIsCitySelected(true);
      } else {
        setCity("");
        setIsCitySelected(false);
      }
    },
    [setCity, locations]
  );

  useEffect(() => {
    searchCity(debouncedTerm, locations);
  }, [searchCity, debouncedTerm, locations]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="relative w-full">
          <input
            className={`w-full pl-10 lg:pl-14 pr-1 py-1 border-black border-solid rounded-lg border-2 outline-none ${
              isCitySelected ? "font-bold" : ""
            } lg:text-xl`}
            data-cy="input"
            type="text"
            placeholder="City, Country"
            list="cities"
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />
          <div className="absolute inset-0 flex items-align justify-between pointer-events-none">
            <Search className="ml-3 lg:ml-5 w-5" />
            {term && (
              <Cross
                className="mr-7 lg:mr-10 w-5 pointer-events-auto"
                onClick={() => {
                  setTerm("");
                  setCity("");
                  setIsCitySelected(false);
                }}
              />
            )}
          </div>
        </div>

        <datalist id="cities">
          {locations &&
            locations.map((l) => (
              <option
                key={l.slug}
                onMouseOver={() => console.log("Focusing " + l.slug)}
              >{`${l.name}, ${l.country}`}</option>
            ))}
        </datalist>

        {!isCitySelected && term && (
          <NoData
            message={`Location "${debouncedTerm}" doesn't exist in our database.`}
          />
        )}
      </div>
    </>
  );
};

export default InputBox;
