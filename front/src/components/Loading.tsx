import React from "react";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div className="p-2 md:p-4">
      <p className="text-xs">Loading...</p>
    </div>
  );
};

export default Loading;
