import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import { F_ } from "../util/Utils";


export const StoreMovementListResponse = () => {
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
            { orders.map( (order, i) => (
                    <div className="movement" key={i} onClick={() =>  navigator(`/admin/inventory/storemovresp/${order.id}`, {replace: false})}>
                        <div className={`movement-${order.status}`}></div>
                        <div className="movement-c">
                            <div className="info">
                                <h3>{order.from_store.name}</h3>
                                <small className="text-muted"> From Store </small>
                            </div>
                            <div className="info">
                                <h3>{order.to_store.name}</h3>
                                <small className="text-muted"> To Store </small>
                            </div>
                            <div className="info">
                                <h3>{order.status}</h3>
                                <small className="text-muted"> Order Status </small>
                            </div>
                            <div className="info">
                                <h3>{order.memo}</h3>
                                <small className="text-muted"> Memo</small>
                            </div>
                            <div className="info">
                                <h3 className="name-inv">{order.name}</h3>
                                <small className="text-muted"> Name </small>
                            </div>
                            <div className="info">
                                <h3>{F_(order.value_in_order)}</h3>
                                <small className="text-muted"> Value In Movement</small>
                            </div>
                            <div className="info">
                                <h3>{order.products_in_order} / {order.products_in_order_issue}</h3>
                                <small className="text-muted"> Products In Order / Issues</small>
                            </div>
                            <div className="info">
                                <h3>{order.date_opened} / {order.date_closed}</h3>
                                <small className="text-muted"> Date Open / Close</small>
                            </div>
                            <div className="info">
                                <h3>{order.user_requester} / {order.user_receiver}</h3>
                                <small className="text-muted">User Opener / Close</small>
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
        </React.Fragment>
    )
};