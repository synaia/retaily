import React from "react";
import { Product } from "./Product";
import { useAPI } from "../context/app-context";
import { Loading } from "./Loading";

export const ProductGrid = ({productItems, loading}) => {
    console.log('ProductGrid: rendered.')
    const { pickProduct } = useAPI();

    const pick = (e) => {
        let productId = Number(e.currentTarget.dataset.productId);
        pickProduct(productId);
    }

    return (
        <div id="products" className="products">
            {loading && <Loading  Text="Loading products ...."/>}
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
