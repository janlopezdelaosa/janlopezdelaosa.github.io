import React from "react";

interface NoDataProps {
  className?: string;
  message?: string;
  suggestion?: string;
}

const NoData: React.FC<NoDataProps> = ({
  className = "",
  message = "There is no available data.",
  suggestion = "Try another city from the list.",
}) => {
  return (
    <div className={`p-4 md:p-6 self-center text-center ${className}`}>
      <p data-cy="msg">{message}</p>
      <p>{suggestion}</p>
    </div>
  );
};

export default NoData;
