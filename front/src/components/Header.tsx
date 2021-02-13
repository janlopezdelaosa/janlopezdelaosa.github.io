import React from "react";
import dayjs from "dayjs";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="p-4 md:px-20 flex justify-between items-center">
      <h2 className="font-extrabold uppercase lg:text-2xl">
        Weather Forecaster y talsss
      </h2>
      <p className="text-xs lg:text-lg">
        {dayjs().format("MMMM D, YYYY | hh:mm")}
      </p>
    </div>
  );
};

export default Header;
