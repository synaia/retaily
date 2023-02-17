import React from "react";
import { Link } from "react-router-dom";
import { Client } from "./Client";
import { useAPI } from "../context/app-context";

export const Numpad = () => {
    console.log('Numpad: rendered.')

    const { clients, setClients, isclientloading, assigClient, kickProduct, reduceProduct } = useAPI();

    const setClient = () => {
        const rdm = Math.floor(Math.random() * clients.length) + 1;
        const clientPicked = [...clients][rdm];
        assigClient(clientPicked);
    };

    const removeProductFromPicket = () => {
        let itemcard_selected = Array.from(document.querySelectorAll('.product-picked-selected'))[0]
        if (itemcard_selected != undefined) {
            const product_id = itemcard_selected.dataset.productId
            kickProduct(product_id)
        }
    }

    const reduceProductFromPicket = () => {
        let itemcard_selected = Array.from(document.querySelectorAll('.product-picked-selected'))[0]
        if (itemcard_selected != undefined) {
            const product_id = itemcard_selected.dataset.productId
            reduceProduct(product_id)
        }
    }

    return (
        <div className="bottom-left-side">
                <div className="numpad-btn" onClick={reduceProductFromPicket}>
                     <p className="numpad-btn__text">minus</p>
                </div>
                <div className="numpad-btn" onClick={removeProductFromPicket}>
                    <p>remove</p>
                </div>
                <div className="numpad-btn">
                    <p>BTN 3</p>
                </div>
                <div className="numpad-btn">
                    <p>BTN 4</p>
                </div>
                <div className="numpad-btn">
                    <p>BTN 5</p>
                </div>
                <div className="numpad-btn">
                     <p>BTN 6</p>
                </div>
            </div>
    );
}

            