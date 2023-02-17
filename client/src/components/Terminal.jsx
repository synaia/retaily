import React from "react";
import { Numpad } from "./Numpad";
import { ProductPicked } from "./ProductPicked";
import { ResumeSaleBox } from "./ResumeSaleBox";
import { useAPI } from '../context/app-context'
import { ProductGrid } from "./ProductGrid";
import { Header } from "./Header";
import { FindClient } from "./FindClient";
import { useEffect } from "react";


export const Terminal = () => {
    console.log('Terminal: rendered.')
    const {productItems, isproductsLoading, sale} = useAPI();

    useEffect(() => {
        // Change Theme
        const themeToggler = document.querySelector(".theme-toggler");
        themeToggler.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme-variables");
            themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
            themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        });
    })

    return(
        // <div id="views/saleView">
        //     <div className="tile is-ancestor app_screen" id="sales_screen">
        //         <div className="tile is-vertical is-12 x_content">
        //             <div className="tile" >
        //                 <div className="tile is-parent is-vertical is-4 fullarea">
        //                     <div className="tile is-child  listproduct">
        //                         <ProductPicked />
        //                         <ResumeSaleBox />
        //                     </div>
        //                     <Numpad/>
        //                 </div>
        //                 <div className="tile is-parent is-8 fullarea">
        //                     <div className="tile is-child notification is-info tile_products">
        //                         <div>{sale.client != null && <h2>Cliente: [{sale.client.name}]</h2>}</div>
        //                         <input className="input is-primary search_btn" type="text" placeholder="consulte aqui"/>
        //                         <a className="button is-success refresh-products">
        //                         <span className="icon is-small">
        //                             <i className="fas fa-cloud-upload-alt"></i>
        //                         </span>
        //                         </a>
        //                         <ProductGrid productItems={productItems} loading={isproductsLoading} />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    <div className="container-terminal">

        <div className="left-side-terminal">
            
            <FindClient />
            
            <ProductPicked />

            <ResumeSaleBox />

            <Numpad />

        </div>


        <main>
            <Header />

            <div className="search-terminal">
                <input type="text" />
            </div>

            <ProductGrid productItems={productItems} loading={isproductsLoading} />
        </main>
    </div>

    );
}
