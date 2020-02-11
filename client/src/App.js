
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Register from "./pages/Register";
import MailPage from "./pages/MailPage";
import ConfirmPage from "./pages/ConfirmPage";
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
  },
  {
    name: "mail",
    path: "/mail",
    isPrivate: false,
    isAdmin: false,
    component: MailPage
  },
  {
    name: "register",
    path: "/register",
    isPrivate: false,
    isAdmin: false,
    isExact: true,
    component: Register
  },
  {
    name: "register",
    path: "/register/:id",
    isPrivate: false,
    isAdmin: false,
    component: Register
  },
  {
    name: "login",
    path: "/login",
    isPrivate: false,
    isAdmin: false,
    component: LoginPage
  },
  {
    name: "confirm",
    path: "/confirm/:id",
    isPrivate: false,
    isAdmin: false,
    component: ConfirmPage
  },
  {
    name: "confirm",
    path: "/dashboard",
    isPrivate: false,
    isAdmin: false,
    component: DashboardPage
  },
];


export default function App() {
  return (
    <Router>
      {/* <Nav /> */}
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