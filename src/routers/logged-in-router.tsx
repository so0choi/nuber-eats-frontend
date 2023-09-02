import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Restaurants } from "../screens/client/restaurants";
import { NotFound } from "../screens/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../screens/user/confirm-email";
import { EditProfile } from "../screens/user/edit-profile";
import { Search } from "../screens/client/search";

const ClientRoutes = [
  <Route key="restaurants" path="/" exact>
    <Restaurants />
  </Route>,
  <Route key="confirm-email" path="/confirm" exact>
    <ConfirmEmail />
  </Route>,
  <Route key="edit-profile" path="/edit-profile" exact>
    <EditProfile />
  </Route>,
  <Route key="search" path="/search" exact>
    <Search />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (loading || !data || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
