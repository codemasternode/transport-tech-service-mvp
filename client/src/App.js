
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import AdminRoute from './components/routes/AdminRoute'
import PrivateRoute from './components/routes/PrivateRoute'

export const routes = [
  {
    name: "home",
    path: "/",
    isPrivate: false,
    isAdmin: false,
    component: Home,
    isExact: true
  },
  {
    name: "search",
    path: "/search",
    isPrivate: false,
    isAdmin: false,
    component: SearchPage
  }
];


export default function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        {routes.map((value, index) =>
          value.isExact ? (
            value.isPrivate ? (

              <PrivateRoute
                key={index}
                path={value.path}
                exact
                component={value.component}
              />
            ) : value.isAdmin ? (
              <AdminRoute key={index} path={value.path} exact component={value.component} />
            ) : (
                  <Route key={index} path={value.path} exact component={value.component} />
                )
          ) : value.isPrivate ? (
            <PrivateRoute key={index} path={value.path} component={value.component} />
          ) : value.isAdmin ? (
            <AdminRoute key={index} path={value.path} component={value.component} />
          ) : (

                  <Route key={index} path={value.path} component={value.component} />

                )
        )}
        <Route component={NotFound} />

      </Switch>
    </Router>
  );
}