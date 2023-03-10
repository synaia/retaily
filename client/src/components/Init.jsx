/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { useDispatch } from "react-redux";
import { loadProducts } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";



export const Init = () => {
    const dispatch = useDispatch();
    dispatch(loadProducts());
    dispatch(loadClients());
    return (
        <React.Fragment></React.Fragment>
    );
};