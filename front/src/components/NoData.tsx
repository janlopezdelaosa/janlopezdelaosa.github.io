import React from "react";

interface NoDataProps {
  message?: string;
  suggestion?: string;
}

const NoData: React.FC<NoDataProps> = ({
  message = "There is no available data.",
  suggestion = "Try another city from the list.",
}) => {
  return (
    <div className="p-4 md:p-6 self-center text-center">
      <p data-cy="msg">{message}</p>
      <p>{suggestion}</p>
    </div>
  );
};

export default NoData;
