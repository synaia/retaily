/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { interceptor } from "../redux/features/user.feature.js";
import { users, scopes } from "../redux/features/user.feature.js";
import { addMessage } from "../redux/features/user.feature.js";
import { getStoresInv, loadProducts, salesTotal } from  "../redux/features/product.feature.js";
import { loadAllProducts } from  "../redux/features/product.feature.js";
import { getPricingLabels } from  "../redux/features/product.feature.js";
import { getPricing } from  "../redux/features/product.feature.js";
import { loadClients } from  "../redux/features/client.feature.js";
import { getStores } from "../redux/features/product.feature.js";

import { getMovProductOrders } from "../redux/features/product.feature.js";
import { getPurchaseProductOrders } from "../redux/features/product.feature.js";
import { loadProviders } from "../redux/features/provider.feature.js";
import { getBulkOrder } from  "../redux/features/product.feature.js";
import { getDelivery } from  "../redux/features/product.feature.js";
import { sequences } from "../redux/features/sale.feature.js";
import { Loading } from "./Loading.jsx";

import { trouble } from "../redux/features/sale.feature.js";
import { BACKEND_HOST_WWS } from "../util/constants.js";



export const Init = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const loading_all_products = useSelector((store) => store.product.loading_all_products);
    // const navigator = useNavigate();
    const dispatch = useDispatch();
    // TODO: instance.interceptors.request.clear();
    dispatch(interceptor());

    
    //TODO: here background task printer-check-status.
    useEffect(() => {
        const printerCheckTask = () => {
            setTimeout(printerCheckTask, 5000);
            dispatch(trouble());
        }
        printerCheckTask();

    }, []);



    useEffect(() => {
        let ws;

        const onMessageEvent = (event) => {
            const data = JSON.parse(event.data);
            if (data.sharable != undefined) {
                dispatch(addMessage(data));

                // TODO: very greedyy ... parametrize for cases.
                // test only
                dispatch(getMovProductOrders());
                dispatch(getPurchaseProductOrders());
                dispatch(getBulkOrder());

            } else {
                console.log(data);
            }
        }

        
        if (currentUser && currentUser.is_logout == null) {
            dispatch(users());
            dispatch(scopes());
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
            dispatch(sequences());
            dispatch(getDelivery());

            dispatch(salesTotal())

            if (currentUser.selectedStore != undefined) {
                console.log('***** useffect', currentUser.selectedStore )

                ws = new WebSocket(`${BACKEND_HOST_WWS}/products/messages/${currentUser.selectedStore}`);
                ws.addEventListener("message", onMessageEvent);
            }
        }

        return () => {
            if (ws != null) {
                ws.removeEventListener("message", onMessageEvent);
            }
        }
        
    }, [currentUser]);

    useLayoutEffect(() => {
        if (currentUser != undefined && currentUser.selectedStore != undefined) {
            console.log('***** useLayoutEffect', currentUser.selectedStore )
        }
    }, [currentUser])


    return (
        <React.Fragment>
            {loading_all_products && <Loading Text="retaily." Intro="true" />}
        </React.Fragment>
    );
};