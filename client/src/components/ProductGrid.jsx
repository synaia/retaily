import React from "react";
import { Product } from "./Product";
import { useAPI } from "../context/app-context";

export const ProductGrid = ({productItems, loading}) => {
    console.log('ProductGrid: rendered.')
    const { pickProduct } = useAPI();

    const pick = (e) => {
        let productId = Number(e.currentTarget.dataset.productId);
        pickProduct(productId);
    }

    return (
        <div id="products" className="products">
            {loading && <div>Loading lalala ;D  .... </div>}
            {!loading && (
                productItems.map((product, i)=> (
                    <Product 
                        product={product}
                        func={pick}
                        key={i}
                    />
                ))
            )}
        </div>
    );
}
