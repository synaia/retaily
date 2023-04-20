/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { useDispatch } from "react-redux";

import { getStoresInv, loadProducts } from  "../redux/features/product.feature.js";
import { loadAllProducts } from  "../redux/features/product.feature.js";
import { getPricingLabels } from  "../redux/features/product.feature.js";
import { getPricing } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";
import { getStores } from "../redux/features/product.feature.js";
import { getProductsAllInventory } from "../redux/features/product.feature.js";
import { getMovProductOrders } from "../redux/features/product.feature.js";
import { getPurchaseProductOrders } from "../redux/features/product.feature.js";
import { loadProviders } from "../redux/features/provider.feature.js";



export const Init = () => {
    // const navigator = useNavigate();
    const dispatch = useDispatch();
    dispatch(loadProducts());
    dispatch(loadAllProducts());
    dispatch(loadClients());
    dispatch(getPricingLabels());
    dispatch(getPricing());
    dispatch(getStores());
    dispatch(getProductsAllInventory());
    dispatch(getMovProductOrders());
    dispatch(getPurchaseProductOrders());
    dispatch(loadProviders());

    return (
        <React.Fragment></React.Fragment>
    );
};