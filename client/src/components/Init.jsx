/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { interceptor } from "../redux/features/user.feature.js";
import { users } from "../redux/features/user.feature.js";
import { getStoresInv, loadProducts } from  "../redux/features/product.feature.js";
import { loadAllProducts } from  "../redux/features/product.feature.js";
import { getPricingLabels } from  "../redux/features/product.feature.js";
import { getPricing } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";
import { getStores } from "../redux/features/product.feature.js";

import { getMovProductOrders } from "../redux/features/product.feature.js";
import { getPurchaseProductOrders } from "../redux/features/product.feature.js";
import { loadProviders } from "../redux/features/provider.feature.js";
import { getBulkOrder } from  "../redux/features/product.feature.js";



export const Init = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    // const navigator = useNavigate();
    const dispatch = useDispatch();
    // TODO: instance.interceptors.request.clear();
    dispatch(interceptor());

    useEffect(() => {
        if (currentUser && currentUser.is_logout == null) {
            dispatch(users());
            dispatch(loadProducts());
            dispatch(loadAllProducts());
            dispatch(loadClients());
            dispatch(getPricingLabels());
            dispatch(getPricing());
            dispatch(getStores());
            
            dispatch(getMovProductOrders());
            dispatch(getPurchaseProductOrders());
            dispatch(loadProviders());
            dispatch(getBulkOrder());
        }
    }, [currentUser]);

    return (
        <React.Fragment></React.Fragment>
    );
};