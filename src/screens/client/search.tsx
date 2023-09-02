import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Search: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, []);
  return <h1>Search page</h1>;
};
