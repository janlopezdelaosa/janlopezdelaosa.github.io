import React from "react";

interface LoadingProps {
  className?: string;
  resource?: string;
}

const Loading: React.FC<LoadingProps> = ({ className = "", resource = "" }) => {
  return (
    <div className={`p-2 md:p-4 ${className}`}>
      <p>Loading{resource && " " + resource}...</p>
    </div>
  );
};

export default Loading;
