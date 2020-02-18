import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from '../../services/AuthService'


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            AuthService.isLoggedIn() ? (
                <Component {...props} />
            ) : (
                    <Redirect to="/" />
                )
        }
    />
);

export default PrivateRoute;