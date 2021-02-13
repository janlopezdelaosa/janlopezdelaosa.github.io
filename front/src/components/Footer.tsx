import React from "react";
import dayjs from "dayjs";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="p-4 flex flex-row-reverse">
      <p className="text-xs">janlopezdelaosa@gmail.com</p>
    </div>
  );
};

export default Footer;
