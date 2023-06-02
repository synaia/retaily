import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Numpad } from "./Numpad";
import { ProductPicked } from "./ProductPicked";
import { ResumeSaleBox } from "./ResumeSaleBox";
import { ProductGrid } from "./ProductGrid";
import { Header } from "./Header";
import { FindClient } from "./FindClient";
import { redirect_pass } from "../redux/features/sale.feature.js";

import '../../assets/style.css';



export const Terminal = () => {
    const loading = useSelector((store) => store.product.loading);
    const dispatch = useDispatch();
    console.log('Terminal: rendered.')

    useEffect(() => {
        // Change Theme
        const themeToggler = document.querySelector(".theme-toggler");
        themeToggler.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme-variables");
            themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
            themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        });

        dispatch(redirect_pass(false));

    }, []);
    



    return(
        <div className="container-terminal">

            <div className="left-side-terminal">
                
                <FindClient />
                
                <ProductPicked />

                <ResumeSaleBox />

                <Numpad />

            </div>


            <main>
                <Header />

                <ProductGrid />
            </main>
        </div>
    );
}
