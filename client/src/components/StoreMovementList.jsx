import React from "react";
import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import { F_, validateInputX } from "../util/Utils";
import { addProductOrder } from "../redux/features/product.feature.js";


export const StoreMovementList = () => {
    const navigator = useNavigate();
    const params = useParams();
    const order_id = 1;
    const order_type = 'internal';

    const orders = useSelector((state) => state.product.orders);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const [errorMemo, SetErrorMemo] = useState(null);
    const dispatch = useDispatch();

    const memo = useRef();

    const cleanInput = () => {
        memo.current.value = '';
    };

    const __addProductOrder = () => {
        if (!validateInputX(memo, "str", SetErrorMemo)) {
            return;
        }

        const order = {
            "name": `MOV-${params.store_name}-${(new Date()).toISOString().substring(0, 10)}`,
            "memo": memo.current?.value,
            "order_type": order_type,
            "user_requester": "userloged"
        }

        dispatch(addProductOrder(order));

        cleanInput();
    };

    return (
        <React.Fragment>
            {!loading && errorMessage && <div className="danger">{errorMessage} </div>}
            <div className="price-list">
                <div>
                    <span>Memo</span>
                    <div className="price-list-b">
                        <span className="material-icons-sharp price-list-i"> edit_note </span>
                        <input type="text" className="price-list-t" ref={memo} onKeyUp={() => SetErrorMemo(null)} />
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorMemo}</span>
                </div>
                <div>
                    <button className="fbutton fbutton-price-list" onClick={() => __addProductOrder()}>
                        <span className="material-icons-sharp"> rocket_launch </span>
                        <span>OPEN NEW MOVEMENT</span>
                    </button>
                </div>
            </div>
            <div className="movement-top">
            { orders.map( (order, i) => (
                    <div className="movement" key={i} onClick={() =>  navigator(`/admin/inventory/storemov/${order.id}`, {replace: false})}>
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
                                <h3>{order.value_in_order}</h3>
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