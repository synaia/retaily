import React from "react";
import { useEffect } from "react";
import { Numpad } from "./Numpad";
import { ProductPicked } from "./ProductPicked";
import { ResumeSaleBox } from "./ResumeSaleBox";
import { ProductGrid } from "./ProductGrid";
import { Header } from "./Header";
import { FindClient } from "./FindClient";

import '../../assets/style.css';



export const Terminal = () => {
    console.log('Terminal: rendered.')

    useEffect(() => {
        // Change Theme
        const themeToggler = document.querySelector(".theme-toggler");
        themeToggler.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme-variables");
            themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
            themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        });
    });



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
