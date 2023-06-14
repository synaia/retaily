import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kickProductAction, reduceProductAction } from "../redux/features/product.feature.js";
import { discardSaleAction, updateDeliveryValueAction } from "../redux/features/product.feature.js";

import { PrinterBasic } from "../api/printer.js";
import { trouble } from "../redux/features/sale.feature.js";
import { SCOPES } from "../util/constants.js";
import { F_ } from "../util/Utils.js";


export const Numpad = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const delivers = useSelector((state) => state.product.delivers);
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

    const addDeliver = (value) => {
        dispatch(updateDeliveryValueAction(value));
    }

    if (currentUser.scopes.includes(SCOPES.SALES.POS_VELIVERY)) {
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
                    {delivers.map((d, i) => (
                            <div key={i} className="numpad-btn" onClick={() => addDeliver(d.value)}>
                                <p>{F_(d.value)}</p>
                            </div>
                     ))
                     }
                </div>
        );
    } else {
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
                </div>
        );
    }
}

            