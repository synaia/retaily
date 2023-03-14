/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { useDispatch } from "react-redux";
import { loadProducts } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";
import { useEffect } from "react";


export const Init = () => {
    const dispatch = useDispatch();
    dispatch(loadProducts());
    dispatch(loadClients());

    useEffect(() => {
        // Change Theme
        const themeToggler = document.querySelector(".theme-toggler");
        themeToggler.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme-variables");
            themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
            themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == "/") {
                document.querySelector('.search-bar').focus();
            }
        });
    })


    return (
        <React.Fragment></React.Fragment>
    );
};