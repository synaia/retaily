/**
 * @file ProductGrid.jsx
 * @author Wilton Beltre
 * @description  Show the browsable products screen.
 * @version 1.0.0
 * @license MIT
 */


import React, { useState } from "react";
import { Product } from "./Product";
import { useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadProducts, pickProductAction } from "../redux/features/product.feature.js";
import { FixedSizeGrid as Grid } from "react-window";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export const ProductGrid = () => {
    console.log('ProductGrid: rendered.')

    const dispatch = useDispatch();

    const products = useSelector((state) => state.product.products);
    const [products_partial, set_products_partial ] = useState([]);
    const loading = useSelector((store) => store.product.loading);
    const errorMessage = useSelector((store) => store.product.errorMessage);

    const pick = (productId) => {
         dispatch(pickProductAction(productId));

        // # clean selection by clicked
        let itemcard = Array.from(document.querySelectorAll('.product-picked'))
        itemcard.forEach(item => item.classList.remove('product-picked-selected'))
    }

    useEffect(() => {
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

    

    const getImage = (product) => {
        const default_img =  () => { 
            return  'data:image/gif;base64,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s5SczpCzlcyOmM5AYGEhWkf1WsctvZvzdalaR84eJLCAdOv4h96fivrHvS68dRxhOQ7tIIGFBRUV2TqaQ1ezdrQYlZnO0G63mc5AYAGzax3NQu1k61ipVLSysjJS65hsMamuCCxgmtYxGV5jtY4mjMxOE3mto9mCWlLeyURMZ7gE2K2hIDParQHn3de7ca/b437ysNYxDEMdHBxkFmEacIeQ3RoILAILw5jW0SwXGkuydVxeXtbr16/z9hrb0dkidBFYtITApWgdB2Dv9ktiiZcA74lIZzPtH/bat097QfasoK8LAguYmcc629+r1mvnfqvJpiX8l5jdTmABc7TTq7Z+3au+HupsmkI0pN38VJw9eKkwhoVFbR1Nm7els3Gvu4m//4428HLiLiEAWkIAILAAEFgAQGABAIEFgMACAAILAAgsAAQWABBYAEBgASCwAIDAAgACCwCBBQAEFgAQWAAILAAgsACAwAJAYAEAgQUABBYAAgsACCwAILAAEFgAQGABILB4CQAQWABAYAEgsACAwAIAAgsAgQUABBYAEFgACCwAILAAgMACQGABAIEFAAQWAAILAAgsACCwABBYAEBgAQCBBYDAAgACCwAILAAEFgAQWABAYAEgsACAwAJAYAEAgQUABBYAAgsACCwAILAAEFgAQGABAIEFgMACAAILAAgsAAQWABBYAEBgASCwAIDAAgACCwCBBQAEFgAQWAAILAAgsACAwAJAYAEAgQUABBYAAgsACCwABBYAEFgAQGABILAAgMACAAILAIEFAAQWABBYABbB/w8AikAN7h8n10EAAAAASUVORK5CYII=';
        }
        const image_raw = (product.image_raw === null) ? default_img() : product.image_raw;
    
        const productImgStyle = {
            backgroundImage: `url(${image_raw})`,
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat', 
            backgroundPosition: 'center'
        };

        return productImgStyle;
    };

    const Cell = ({ columnIndex, rowIndex, style }) => (
        // <div style={style} className="product-card">
        //    <h3>$ {products[index].name}</h3>
        // </div>
        
        <div className="product-card" style={getImage(products[rowIndex])}>
            <div className="product-card-top">
                <h3>$ {products[rowIndex].price}</h3>
            </div>
            <div className="product-card-bottom">
            <div className="description">{products[rowIndex].inventory.quantity} - {products[rowIndex].name}</div>
            </div>
        </div>
    );

    return (
        <div className="products" id="products">

            {loading && <div>Loading lalala ;D  .... </div>}
            {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
            {!loading && (
                products_partial.map((product, i)=> (
                    <Product 
                        product={product}
                        func={pick}
                        key={i}
                    />
                ))

                // <AutoSizer>
                // {({ height, width }) => (
                // <Grid
                //     columnCount={2}
                //     columnWidth={width/2}
                //     rowCount={products.length}
                //     rowHeight={height/2}
                //     height={height}
                //     width={width}
                // >
                //     {Cell}
                // </Grid>
                // )}
                // </AutoSizer>
                // <AutoSizer>
                // {({ height, width }) => (
                // <List 
                //     className="products"
                //     width={width}
                //     height={height}
                //     itemCount={products.length}
                //     itemSize={600}
                // >
                //     {Cell}
                // </List>
                // )}
                // </AutoSizer>
            )}

        </div>
    );
}
