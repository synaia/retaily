import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getPurchaseProductOrders, cleanBulkOrders } from "../redux/features/product.feature.js";


import { F_ } from "../util/Utils";

import { lang } from "../common/spa.lang.js";



export const PurchaseOrderListResponse = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const order_type = 'movement';

    const orders = useSelector((state) => state.product.purchase_orders);
    const bulk_orders = useSelector((state) => state.product.bulk_orders);
    const stores = useSelector((state) => state.product.stores);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);


    useEffect(() => {
        dispatch(getPurchaseProductOrders());
        return () => { 
            console.log('PurchaseOrderListResponse: cleanBulkOrders')
            dispatch(cleanBulkOrders());
        }
    }, []);

    const isBulkClosed = (bulky) => {
        let flag = true
        bulky.orders.forEach(bo => {
            if (bo.status != "closed") {
                flag = false
                return;
            }
        })
        return flag
    }

    return (
        <React.Fragment>
            <div className="movement-top" >
            <ul className="tree">
            { bulk_orders.map( (bulklist, y) => (
                <React.Fragment key={y} >
                <li >
                    <div className="sticky treehead" onClick={() =>  {
                        if (!isBulkClosed(bulklist)) {
                            return navigator(`/admin/inventory/bulk/${bulklist.bulk_order_id}`, {replace: false})
                        } else {
                            return
                        }
                     }}>
                        {/* <span className="material-icons-sharp"> tour </span> */}
                        <span className="material-icons-sharp"> flash_on </span>
                        <div className="info">
                            <h3>{bulklist.bulk_order_name} {isBulkClosed(bulklist) && 
                                 <span className="material-icons-sharp "> lock </span>
                                }
                            </h3>
                            <small className="text-muted"> {bulklist.bulk_order_memo}</small>
                        </div>
                    </div>
                    <ul>
                    { bulklist.orders.map( (order, i) => (
                        <li key={i} className="li-child">
                            <div className="movement" key={i} onClick={() =>  navigator(`/admin/inventory/purchaseresp/${order.id}`, {replace: false})}>
                                <div className={`movement-${order.status}`}></div>
                                <div className="movement-c">
                                    <div className="info">
                                        <h3>{order.from_store.name}</h3>
                                        <small className="text-muted"> {lang.purchase.from_provider} </small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.to_store.name}</h3>
                                        <small className="text-muted"> {lang.purchase.to_store} </small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.status}</h3>
                                        <small className="text-muted"> {lang.store.status} </small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.memo}</h3>
                                        <small className="text-muted"> Memo </small>
                                    </div>
                                    <div className="info">
                                        <h3 className="name-inv">{order.name}</h3>
                                        <small className="text-muted"> {lang.purchase.name} </small>
                                    </div>
                                    <div className="info">
                                        <h3>{F_(order.value_in_order)}</h3>
                                        <small className="text-muted"> {lang.storemov.value_mov} </small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.products_in_order} / {order.products_in_order_issue}</h3>
                                        <small className="text-muted"> {lang.storemov.product_in_order} / {lang.storemov.issues}</small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.date_opened} / {order.date_closed}</h3>
                                        <small className="text-muted"> {lang.storemov.date_open} / {lang.storemov.date_close}</small>
                                    </div>
                                    <div className="info">
                                        <h3>{order.user_requester} / {order.user_receiver}</h3>
                                        <small className="text-muted">{lang.storemov.user_open}/ {lang.storemov.user_close}</small>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                    }
                    </ul>
                </li>
                </React.Fragment>
            ))
            }
            </ul>
            </div>
        </React.Fragment>
    )
};