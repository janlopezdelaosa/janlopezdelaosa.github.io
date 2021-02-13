import React from "react";
import dayjs from "dayjs";

interface DateSummaryForecastProps {
  isSelected: boolean;
  date: string;
  max: number;
  min: number;
  onClick: () => void;
}

const DateSummaryForecast: React.FC<DateSummaryForecastProps> = ({
  isSelected,
  date,
  max,
  min,
  onClick,
}) => {
  return (
    <div
      className={`p-4 md:p-6 m-2 md:m-4 flex flex-col items-center border-black border-solid rounded-lg border-2 outline-none transform hover:scale-105${
        isSelected ? " font-bold" : ""
      }`}
      onClick={onClick}
    >
      <p className="text-xl lg:text-2xl">
        {dayjs(date, "MM-DD-YYYY").format("DD MMM")}
      </p>
      <div className="flex flex-row justify-between lg:text-lg">
        <p>
          {min}º / {max}º
        </p>
      </div>
    </div>
  );
};

export default DateSummaryForecast;
