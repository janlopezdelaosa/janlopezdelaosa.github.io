import React, { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import WeeklyForecast from "./components/WeeklyForecast";

const App: React.FC = () => {
  const [city, setCity] = useState("");

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <Header />

        <div className="py-4 px-4 md:px-20 w-full flex justify-center">
          <InputBox setCity={setCity} />
        </div>
      </div>

      <div className="pt-32 pb-16 flex flex-col w-full items-center">
        {city !== "" && <WeeklyForecast city={city} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white z-10">
        <Footer />
      </div>
    </>
  );
};

export default App;
