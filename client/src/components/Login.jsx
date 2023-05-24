import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistPreference } from "../api/db.js";

import { auth } from "../redux/features/user.feature.js";

export const Login = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const preferences = useSelector((state) => state.user.preferences);
    const dispatch = useDispatch();

    useEffect(() => {
        // auto login
        const args = {
            'username': 'luis',
            'password': 'luis'
        }
        dispatch(auth(args));
    }, []);

    useEffect(() => {
        console.log(currentUser)
        // persistPreference('store', currentUser.stores[0]); //MADELTA
    }, [currentUser]);

    useEffect(() => {
        console.log(preferences)
    }, [preferences])

    return (
        <>
            <h1>Login component.</h1>
            {currentUser &&
                <h2>{currentUser.access_token}</h2>
            }
        </>
    )
}