import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistPreference } from "../api/db.js";

import { auth } from "../redux/features/user.feature.js";
import { interceptor, changeStore } from "../redux/features/user.feature.js";
import { lang } from "../common/spa.lang.js";

export const Login = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const product_loading = useSelector((state) => state.product.loading);
    const preferences = useSelector((state) => state.user.preferences);
    const loading_function = useSelector((state) => state.user.loading_function);
    const errorMessage = useSelector((state) => state.user.errorMessage);
    const [loggeSucess, SetLoggeSucess] = useState(false);
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const username = useRef();
    const password = useRef();
    const btn = useRef();
    const divLogin = useRef();



    useEffect(() => {
        return  () => {
            console.log('Leaving Login');
            SetLoggeSucess(false);
        }
    }, []);

    const onLogin = () => {
        const args = {
            'username': username.current?.value,
            'password': password.current?.value,
            'loggeSucess': SetLoggeSucess
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
        const store_id = event.target.value;
        const store = currentUser.stores.find(s => s.id == store_id);
        console.log(store);
        dispatch(changeStore(store));
    }

    useEffect(() => {
        if (product_loading) {
            divLogin.current.style.setProperty("--animation-login", "1s");
        } else {
            divLogin.current.style.setProperty("--animation-login", "30s");
        }
        
    }, [product_loading])

    return (
        <>
        <div className="login moving-border" ref={divLogin} >
            {product_loading && 
                <h5>Loading....</h5>
            }
            {!product_loading && 
                <h5>{lang.login.form}</h5>
            }
            {!loggeSucess && 
            <input type="text" ref={username} name="usern" placeholder={lang.login.username} className="text" 
                autoFocus onKeyDown={onEnter}  autoComplete="off" />
            }
            {!loggeSucess && 
            <input type="Password" ref={password} name="passwd" placeholder={lang.login.password} className="text" 
                          onKeyDown={onEnter} />
            }
            {!loggeSucess &&
                <input type="button" ref={btn} name="usern" value={lang.login.login} className="btn" onClick={() => onLogin()} />
            }
            {!product_loading && currentUser != null && currentUser.selectedStore == null && loggeSucess &&
                <div className="select-div select-store-login">
                 <select className="select-from-store" onChange={onChangeStore}>
                    <option disabled selected value> -- {lang.login.store} -- </option>
                     { currentUser.stores.map((s, i) => (
                         <option key={i} value={s.id}>{s.name}</option>
                     ))}
                 </select>
                 </div>
            }

        </div>
        </>
    )
}