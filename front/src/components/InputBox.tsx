import React, { useState } from "react";
import useLocations from "../utils/useLocations";
import Search from "../svg/Search";
import Cross from "../svg/Cross";

interface InputBoxProps {
  setCity: React.Dispatch<React.SetStateAction<string>>;
}

const InputBox: React.FC<InputBoxProps> = ({ setCity }) => {
  const [term, setTerm] = useState("");
  const [isCitySelected, setIsCitySelected] = useState(false);
  const locations = useLocations();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    const location = locations?.filter(
      (l) => `${l.name}, ${l.country}` === e.target.value
    )[0];
    if (location !== undefined) {
      setCity(location.slug);
      setIsCitySelected(true);
    }
  };

  return (
    <>
      <div className="relative w-full">
        <input
          className={`w-full pl-10 lg:pl-14 pr-1 py-1 border-black border-solid rounded-lg border-2 outline-none ${
            isCitySelected ? "font-bold" : ""
          } lg:text-xl`}
          type="text"
          placeholder="City, Country"
          list="cities"
          onChange={onChange}
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
            <option key={l.slug}>{`${l.name}, ${l.country}`}</option>
          ))}
      </datalist>
    </>
  );
};

export default InputBox;
