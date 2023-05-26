import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistPreference } from "../api/db.js";

import { auth } from "../redux/features/user.feature.js";
import { interceptor } from "../redux/features/user.feature.js";

export const Login = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const preferences = useSelector((state) => state.user.preferences);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const username = useRef();
    const password = useRef();

    const onLogin = () => {
        const args = {
            'username': username.current?.value,
            'password': password.current?.value
        }
        dispatch(auth(args));
        // navigator('/#/admin', {replace: true});
    }

    useEffect(() => {
        if (currentUser != null) {
            // console.log(currentUser)

            // persistPreference('store', currentUser.stores[0]); //MADELTA

            // dispatch(interceptor());
        }
    }, [currentUser]);

    useEffect(() => {
        // if (preferences != null){
        //     console.log(preferences)
        // }
    }, [preferences])

    return (
        <>
           <div className="login">
            <h5>Login Form</h5>
            <input type="text" ref={username} name="usern" placeholder="Username" className="text" />
            <input type="Password" ref={password} name="usern" placeholder="Password" className="text" />
            <input type="button" name="usern" value="Login" className="btn" onClick={() => onLogin()} />
        </div>
        </>
    )
}