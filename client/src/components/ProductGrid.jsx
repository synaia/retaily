import React from "react";
import { Product } from "./Product";
import { useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadProducts, pickProductAction } from "../redux/features/product.feature.js";
import { createSelector } from "@reduxjs/toolkit";

const selectProducts = createSelector(
    (state) => state.product.products,
    (products) => products
);

export const ProductGrid = () => {
    console.log('ProductGrid: rendered.')

    const dispatch = useDispatch();

    const products = useSelector((state) => state.product.products);
    // const saleState = useSelector((store) => store.product.sale);

    const loading = useSelector((store) => store.product.loading);
    const errorMessage = useSelector((store) => store.product.errorMessage);

    useEffect(() => {
        dispatch(loadProducts());
    }, [dispatch]);

    const pick = (productId) => {
         dispatch(pickProductAction(productId));
    }

    return (
        <div id="products" className="products">
            {/* {saleState.products.length > 0 && 
               saleState.products.map((product, i) => (
                <li key={i}>{product.id} - {product.inventory.quantity_for_sale} - {product.name}</li>
               ))
            } */}
            {loading && <div>Loading lalala ;D  .... </div>}
            {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
            {!loading && (
                products.map((product, i)=> (
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
