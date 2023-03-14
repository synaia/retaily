import React from "react";
import { Numpad } from "./Numpad";
import { ProductPicked } from "./ProductPicked";
import { ResumeSaleBox } from "./ResumeSaleBox";
import { ProductGrid } from "./ProductGrid";
import { Header } from "./Header";
import { FindClient } from "./FindClient";


export const Terminal = () => {
    console.log('Terminal: rendered.')

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
