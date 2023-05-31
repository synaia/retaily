/**
 * @file ProductGrid.jsx
 * @author Wilton Beltre
 * @description  Show the browsable products screen.
 * @version 1.0.0
 * @license MIT
 */

import React, { useState } from "react";
import { Product } from "./Product";
import { useEffect, useRef } from "react";
import { useDispatch , useSelector} from "react-redux";
import { pickProductAction } from "../redux/features/product.feature.js";
import { Loading } from "./Loading";


export const ProductGrid = () => {
    console.log('ProductGrid: rendered.')

    const dispatch = useDispatch();

    const products = useSelector((state) => state.product.products);
    const [products_partial, set_products_partial ] = useState([]);
    const loading = useSelector((store) => store.product.loading);
    const errorMessage = useSelector((store) => store.product.errorMessage);

    const search = useRef();

    const pick = (productId) => {
         dispatch(pickProductAction(productId));

        // # clean selection by clicked
        let itemcard = Array.from(document.querySelectorAll('.product-picked'))
        itemcard.forEach(item => item.classList.remove('product-picked-selected'))
    }

    const filterProduct = (ev) => {
        let keyin = search.current?.value;
        let list_filtered = products.filter((prod) => {
            if (prod) {
                let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                let has = prod.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                return  has ||
                    prod.code.toUpperCase().includes(keyin.toUpperCase());
            } else {
                return false;
            }
        });

        set_products_partial(list_filtered, ...products_partial);
        
        if (13 === ev.keyCode) {
            ev.target.select();
        }
    };

    useEffect(() => {
        console.log('set_products_partial(products.slice(0, 20));');
        set_products_partial(products.slice(0, 20));
        const prodObject  = document.querySelector('.products');
        let c = 1;
        const WINDOW = 200;
        prodObject.addEventListener('scroll', (event) => {
            const y = prodObject.scrollTop;
            // console.log(y);
            if (y > (200 * c)) {
                console.log(`y : ${y}`);
                c += 1;
                set_products_partial(...products_partial, products.slice(0, 9*c));
            }
            // if( prodObject.scrollTop === (prodObject.scrollHeight - prodObject.offsetHeight)) {
            //     console.log(`y : ${y}`);
            //     c += 1;
            //     set_products_partial(...products_partial, products.slice(0, 20*c));
            // }
        });
        console.log(prodObject);
    }, [products]);

    return (
        <React.Fragment>
            <div className="search-terminal">
                <span className="material-icons-sharp"> search </span>
                <input ref={search} type="text" onKeyUp={filterProduct} className="search-bar" />
                <span className="underline-animation-terminal"></span>
            </div>

            <div className="products" id="products">

                {loading && <Loading Text="retaily." Intro="true" />}
                {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
                {!loading && search.current?.value.length > 0 && products_partial.length == 0 && 
                <div> <h1>{search.current?.value?.toUpperCase()} Not found</h1></div> }
                {!loading && (
                    products_partial.map((product, i)=> (
                        <Product 
                            product={product}
                            func={pick}
                            key={i}
                        />
                    ))
                )}
            </div>
        </React.Fragment>
    );
}
