import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {UserPage} from "./pages/UserPage";
import {NewsPage} from "./pages/NewsPage";
import {AuthPage} from "./pages/AuthPage";
import {RegisterPage} from "./pages/RegisterPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/user/:id" >
                    <UserPage />
                </Route>
                <Route path="/news" exact>
                    <NewsPage />
                </Route>
                <Redirect to="/news" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Route path = "/register" exact>
                <RegisterPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}