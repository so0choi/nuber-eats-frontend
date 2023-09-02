import React from "react";
import { Link } from "react-router-dom";

interface ILinkProps {
  text: string;
  destination: string;
}

export const CustomLink: React.FC<ILinkProps> = ({ text, destination }) => {
  return (
    <Link to={destination} className="hover:underline text-lime-600">
      {text}
    </Link>
  );
};
