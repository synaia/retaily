/**
 * @file ProductGrid.jsx
 * @author Wilton Beltre
 * @description  Show the browsable products screen.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { Product } from "./Product";
import { useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadProducts, pickProductAction } from "../redux/features/product.feature.js";


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

        // # clean selection by clicked
        let itemcard = Array.from(document.querySelectorAll('.product-picked'))
        itemcard.forEach(item => item.classList.remove('product-picked-selected'))
    }

    return (
        <div id="products" className="products">
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
