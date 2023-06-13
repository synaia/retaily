import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import { F_ } from "../util/Utils";


import { lang } from "../common/spa.lang.js";



export const StoreMovementListResponse = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigator = useNavigate();
    const params = useParams();
    const order_type = 'movement';

    const orders = useSelector((state) => state.product.orders);
    const stores = useSelector((state) => state.product.stores);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);


    useEffect(() => {
        console.log(stores)
    }, [stores]);


    return (
        <React.Fragment>
            {!loading && errorMessage && <div className="danger">{errorMessage} </div>}
            <div className="movement-top">
            { orders.map( (order, i) => {
                if (currentUser.username !== order.user_requester) {
                    return  (
                        <div className="movement" key={i} onClick={() =>  navigator(`/admin/inventory/storemovresp/${order.id}`, {replace: false})}>
                            <div className={`movement-${order.status}`}></div>
                            <div className="movement-c">
                                <div className="info">
                                    <h3>{order.from_store.name}</h3>
                                    <small className="text-muted"> {lang.storemov.from_store} </small>
                                </div>
                                <div className="info">
                                    <h3>{order.to_store.name}</h3>
                                    <small className="text-muted"> {lang.storemov.to_store}  </small>
                                </div>
                                <div className="info">
                                    <h3>{order.status}</h3>
                                    <small className="text-muted"> {lang.storemov.status}  </small>
                                </div>
                                <div className="info">
                                    <h3>{order.memo}</h3>
                                    <small className="text-muted"> Memo</small>
                                </div>
                                <div className="info">
                                    <h3 className="name-inv">{order.name}</h3>
                                    <small className="text-muted"> {lang.storemov.name}  </small>
                                </div>
                                <div className="info">
                                    <h3>{F_(order.value_in_order)}</h3>
                                    <small className="text-muted"> {lang.store.value_inventory} </small>
                                </div>
                                <div className="info">
                                    <h3>{order.products_in_order} / {order.products_in_order_issue}</h3>
                                    <small className="text-muted"> {lang.storemov.product_in_order} / {lang.storemov.issues} </small>
                                </div>
                                <div className="info">
                                    <h3>{order.date_opened} / {order.date_closed}</h3>
                                    <small className="text-muted"> {lang.storemov.date_open}  / {lang.storemov.date_close} </small>
                                </div>
                                <div className="info">
                                    <h3>{order.user_requester} / {order.user_receiver}</h3>
                                    <small className="text-muted">{lang.storemov.user_open} / {lang.storemov.user_close} </small>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
            }
            </div>
        </React.Fragment>
    )
};