
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PricingPlan from "./pages/PricingPlan/index";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import DatabaseDashboard from "./pages/DatabaseDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import VehicleDashboard from "./pages/VehicleDashboard";
import CostsDashboard from "./pages/CostsDashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import DashboardWindowProvider from "./components/provider/dashboard/CreateDashboardContext"

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
    name: "login",
    path: "/login",
    isPrivate: false,
    isAdmin: false,
    component: Login
  },
  {
    name: "register",
    path: "/register",
    isPrivate: false,
    isAdmin: false,
    component: Register
  },
  {
    name: "pricing plan",
    path: "/pricing-plan",
    isPrivate: false,
    isAdmin: false,
    component: PricingPlan
  },
  {
    name: "Database configuration",
    path: "/database-dashboard",
    isPrivate: false,
    isAdmin: false,
    component: DatabaseDashboard
  },
  {
    name: "New employee",
    path: "/employee-dashboard",
    isPrivate: false,
    isAdmin: false,
    component: EmployeeDashboard
  },
  {
    name: "Vehicle",
    path: "/vehicle-dashboard",
    isPrivate: false,
    isAdmin: false,
    component: VehicleDashboard
  },
  {
    name: "Costs Panel",
    path: "/costs-dashboard",
    isPrivate: false,
    isAdmin: false,
    component: CostsDashboard
  },
  {
    name: "profile",
    path: "/profile",
    isPrivate: true,
    isAdmin: false,
    component: Profile
  },
  {
    name: "admin",
    path: "/admin-dashboard",
    isPrivate: false,
    isAdmin: false,
    component: AdminDashboard
  }
];


export default function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <DashboardWindowProvider>
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
        </DashboardWindowProvider>
        <Route component={NotFound} />

      </Switch>
    </Router>
  );
}