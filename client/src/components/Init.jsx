/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadProducts } from  "../redux/features/product.feature.js";
import { loadAllProducts } from  "../redux/features/product.feature.js";
import { getPricingLabels } from  "../redux/features/product.feature.js";
import { getPricing } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";
import { getStores } from "../redux/features/product.feature.js";
import { useEffect } from "react";



export const Init = () => {
    // const navigator = useNavigate();
    const dispatch = useDispatch();
    dispatch(loadProducts());
    dispatch(loadAllProducts());
    dispatch(loadClients());
    dispatch(getPricingLabels());
    dispatch(getPricing());
    dispatch(getStores());

    useEffect(() => {
        // // Change Theme
        // const themeToggler = document.querySelector(".theme-toggler");
        // themeToggler.addEventListener("click", () => {
        //     document.body.classList.toggle("dark-theme-variables");
        //     themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
        //     themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        // });

        // document.addEventListener('keyup', (e) => {
        //     // console.log(e.shiftKey);
        //     // console.log('KEY: ', e.key);
        //     if (e.key == "/") {
        //         document.querySelector('.search-bar').focus();
        //     }

        //     if (e.shiftKey && e.key == "F") {
        //         navigator('/client', {replace: true});
        //     }

        //     if (e.shiftKey && e.key == "P") {
        //         navigator('/payment', {replace: true});
        //     }

        //     if (e.key == "Escape") {
        //         const lc = window.location.href.substring(window.location.href);
        //         if (lc.substring(lc.length-1, lc.length) != "/") {
        //             navigator('/', {replace: true});
        //         }
        //     }
        // });
    })


    return (
        <React.Fragment></React.Fragment>
    );
};