import React from "react";
import { Logo } from "./logo";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Header = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-600 p-3 text-center text-base text-white">
          <span>Please verify your email to continue</span>
        </div>
      )}
      <header className="py-4">
        <div className="container px-5 flex justify-between items-center">
          <Logo size="w-36" />
          <span>
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
