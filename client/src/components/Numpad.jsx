import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { kickProductAction, reduceProductAction } from "../redux/features/product.feature.js";
import { Client } from "./Client";
import { discardSaleAction } from "../redux/features/product.feature.js";

export const Numpad = () => {
    console.log('Numpad: rendered.');
    const dispatch = useDispatch();

    const setClient = () => {
        // const rdm = Math.floor(Math.random() * clients.length) + 1;
        // const clientPicked = [...clients][rdm];
        // assigClient(clientPicked);
    };

    const removeProductFromPicket = () => {
        let itemcard_selected = Array.from(document.querySelectorAll('.product-picked-selected'))[0];
        if (itemcard_selected != undefined) {
            const product_id = itemcard_selected.dataset.productId;
            dispatch(kickProductAction(product_id));
        }
    };

    const reduceProductFromPicket = () => {
        let itemcard_selected = Array.from(document.querySelectorAll('.product-picked-selected'))[0];
        if (itemcard_selected != undefined) {
            const product_id = itemcard_selected.dataset.productId;
            dispatch(reduceProductAction(product_id));
        }
    };

    return (
        <div className="bottom-left-side">
                <div className="numpad-btn" onClick={reduceProductFromPicket}>
                    <span className="material-icons-sharp"> remove </span>
                </div>
                <div className="numpad-btn" onClick={removeProductFromPicket}>
                    <span className="material-icons-sharp"> delete </span>
                </div>
                <div className="numpad-btn" onClick={() => dispatch(discardSaleAction())}>
                    <span className="material-icons-sharp"> delete_sweep </span>
                </div>
                <Link to='/prods'>
                    <div className="numpad-btn">
                        <p>BTN 4</p>
                    </div>
                </Link>
                <div className="numpad-btn">
                    <p>BTN 5</p>
                </div>
                <div className="numpad-btn">
                     <p>BTN 6</p>
                </div>
            </div>
    );
}

            