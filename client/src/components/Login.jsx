import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistPreference } from "../api/db.js";

import { auth } from "../redux/features/user.feature.js";
import { interceptor, changeStore } from "../redux/features/user.feature.js";

export const Login = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const product_loading = useSelector((state) => state.product.loading);
    const preferences = useSelector((state) => state.user.preferences);
    const loading = useSelector((state) => state.user.loading);
    const errorMessage = useSelector((state) => state.user.errorMessage);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const username = useRef();
    const password = useRef();
    const btn = useRef();

    const onLogin = () => {
        const args = {
            'username': username.current?.value,
            'password': password.current?.value
        }
        dispatch(auth(args));
    }

    const onEnter = (event) => {
        if (event.key == 'Enter') {
            if (event.currentTarget.name == 'usern')
                password.current.focus();
            else
                btn.current.click();
        }
    }

    const onChangeStore = (event) => {
        const store = event.target.value;
        console.log(store);
        dispatch(changeStore(store));
    }

    return (
        <>
        <div className="login">
            <h5>Login Form</h5>
            <input type="text" ref={username} name="usern" placeholder="Username" className="text" 
                autoFocus onKeyDown={onEnter}  />
            <input type="Password" ref={password} name="passwd" placeholder="Password" className="text" 
                          onKeyDown={onEnter} />
            {!product_loading && 
                <input type="button" ref={btn} name="usern" value="Login" className="btn" onClick={() => onLogin()} />
            }
            {product_loading && 
                <span>Loading....</span>
            }
            {!product_loading && currentUser != null && currentUser.selectedStore == null &&
                 <select className="select-from-store" onChange={onChangeStore}>
                    <option disabled selected value> -- select your store -- </option>
                     { currentUser.stores.map((s, i) => (
                         <option key={i} value={s}>{s}</option>
                     ))}
                 </select>
            }
            {errorMessage &&
                <h3 className="danger">{errorMessage}</h3>
            }
        </div>
        </>
    )
}