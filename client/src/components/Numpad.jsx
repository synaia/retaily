import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kickProductAction, reduceProductAction } from "../redux/features/product.feature.js";
import { discardSaleAction } from "../redux/features/product.feature.js";

import { PrinterBasic } from "../api/printer.js";
import { trouble } from "../redux/features/sale.feature.js";


export const Numpad = () => {
    const printer = useSelector((state) => state.sale.printer);
    console.log('Numpad: rendered.');
    const dispatch = useDispatch();

    const printerBasic = new PrinterBasic();

    useEffect(() => {
        printerBasic.troubleshooting();
    }, [printer.isrunning]);


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
                <div className="numpad-btn" onClick={() => printerBasic.connectToDevice()}>
                    <p>SEARCH</p>
                </div>
                <div className="numpad-btn" onClick={() => printerBasic.prepareDevice()}>
                    <p>PREPARE</p>
                </div>
                <div className="numpad-btn" onClick={() => printerBasic.print()}>
                     <p>PRINT</p>
                </div>
                <div className="numpad-btn" onClick={() => printerBasic.restart()}>
                     <p>RESTART</p>
                </div>
                <div className="numpad-btn" onClick={() => printerBasic.voluntaryRevoke()}>
                     <p>REVOKE</p>
                </div>
                <div className="numpad-btn" onClick={() => dispatch(trouble())}>
                     <p>STATUS</p>
                </div>
            </div>
    );
}

            