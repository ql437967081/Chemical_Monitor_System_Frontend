import React from "react";
import { Route, Redirect } from 'react-router-dom';
import {withRouter} from "react-router";

class AuthRouter extends React.Component{
    render() {
        const { component: Component, loginRole, ...rest } = this.props;
        const isLogged = sessionStorage.getItem('loginRole') === loginRole;
        return (
            <Route {...rest} render={props => (
                isLogged
                    ? <Component {...props} />
                    : <Redirect to={'/login'} />)} />
        );
    }
}

export default withRouter(AuthRouter);
