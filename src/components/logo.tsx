import React from "react";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";

interface ILogoProps {
  size?: string;
}

export const Logo: React.FC<ILogoProps> = ({ size }) => {
  return (
    <Link to={`/`}>
      <img src={logo} alt="logo" className={size} />
    </Link>
  );
};
