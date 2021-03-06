import React, { useEffect, useState } from "react";
import useForecast from "../api/forecast";
import DateSummaryForecast from "./DateSummaryForecast";
import DateHourlyForecast from "./DateHourlyForecast";
import NoData from "./NoData";

interface WeeklyForecastProps {
  city: string;
  days?: number;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ city, days = 5 }) => {
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  );

  const startDate = today;
  // ISO format example 2021-02-11T18:45:55.136Z
  const startStr = startDate.toISOString().split("T")[0];

  let finishDate = new Date(startDate);
  finishDate.setDate(finishDate.getDate() + days);
  const finishStr = finishDate.toISOString().split("T")[0];

  const forecast = useForecast(city, startStr, finishStr);

  const [hourly, setHourly] = useState<number[]>([]);

  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    if (selected !== -1) {
      setHourly(forecast[selected]?.hourly);
    }
  }, [forecast, selected]);

  return (
    <>
      <div className="p-2 md:p-4 flex flex-wrap flex-row justify-center">
        {forecast !== undefined && forecast.length > 0 ? (
          forecast?.map((d, i) => {
            const min = Math.min(...d.hourly);
            const max = Math.max(...d.hourly);
            return (
              <DateSummaryForecast
                key={i}
                isSelected={i === selected}
                date={d.date}
                max={max}
                min={min}
                onClick={() => {
                  setHourly(d.hourly);
                  setSelected(i);
                }}
              />
            );
          })
        ) : (
          <NoData message="No forecast data for any of the following 5 days." />
        )}
      </div>
      {hourly.length !== 0 && <DateHourlyForecast hourly={hourly} />}
    </>
  );
};

export default WeeklyForecast;
