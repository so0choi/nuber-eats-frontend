import React from "react";
import { Link } from "react-router-dom";
import { CustomLink } from "../components/link";
import { Title } from "../components/title";
import { Helmet } from "react-helmet-async";

export const NotFound = () => (
  <div className="h-screen flex items-center justify-center flex-col">
    <Helmet>
      <title>Page Not Found | Nuber Eats</title>
    </Helmet>
    <h4 className="font-medium mb-5 text-base">
      The page you are looking for does not exist or has moved.
    </h4>
    <CustomLink text="Go back home &rarr;" destination="/" />
  </div>
);
