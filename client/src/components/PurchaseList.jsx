import React from "react";
import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import { F_, validateInputX } from "../util/Utils";
import { addProductOrder, getInventoryHeadByStoreId } from "../redux/features/product.feature.js";


export const PurchaseList = () => {
    const navigator = useNavigate();
    const params = useParams();
    const order_type = 'purchase';

    const orders = useSelector((state) => state.product.orders);
    const stores = useSelector((state) => state.product.stores);
    const providers = useSelector((state) => state.provider.providers);
    const inventory_head_by_store = useSelector((state) => state.product.inventory_head_by_store);
    const [toStores, SetToStores] = useState([]);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const dispatch = useDispatch();

    const memo = useRef();
    const from_origin = useRef();
    const to_store = useRef();

    const [errorMemo, SetErrorMemo] = useState(null);
    const [errorFromOrigin, SetErrorFromOrigin] = useState(null);
    const [errorToStore, SetErrorToStore] = useState(null);
    

    const cleanInput = () => {
        memo.current.value = '';
    };

    const __addProductOrder = () => {
        if (!validateInputX(memo, "str", SetErrorMemo)) {
            return;
        }

        if (!validateInputX(from_origin, "number", SetErrorFromOrigin)) {
            return;
        }

        if (!validateInputX(to_store, "number", SetErrorToStore)) {
            return;
        }

        if (inventory_head_by_store.meta.code === "success") {
            SetErrorFromOrigin('This Store has a Open Inventory, first conclude and then back here.');
            return;
        }

        const order_request = {
            "name": `MOV-${from_origin.current.value}-${(new Date()).toISOString().substring(0, 10)}`,
            "memo": memo.current?.value,
            "order_type": order_type,
            "user_requester": "userloged",
            "from_store": { "id": from_origin.current.value },
            "to_store": { "id": to_store.current.value }
        }

        console.log(order_request);

        dispatch(addProductOrder(order_request));

        cleanInput();
    };

    useEffect(() => {
        console.log(stores)
    }, [stores]);

    const OnChangeOrigin = () => {
        SetToStores(stores);
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
                    <span>From Provider</span>
                    <div className="select-div">
                        <select className="select-from-store" ref={from_origin} onChange={OnChangeOrigin}>
                        <option disabled selected value> -- select a provider -- </option>
                            { providers.map((provider, i) => (
                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                            ))}
                        </select>
                    </div>
                    <span className="error-msg">{errorFromOrigin}</span>
                </div>
                <div>
                    <span>To Store</span>
                    <div className="select-div">
                        <select className="select-from-store" ref={to_store}>
                        <option disabled selected value> -- select a store -- </option>
                            { toStores.map((s, i) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <span className="error-msg">{errorToStore}</span>
                </div>
                <div>
                    <button className="fbutton fbutton-price-list" onClick={() => __addProductOrder()}>
                        <span className="material-icons-sharp"> rocket_launch </span>
                        <span>OPEN NEW PURCHASE</span>
                    </button>
                </div>
            </div>
            <div className="movement-top">
            { orders.map( (order, i) => (
                    <div className="movement" key={i} onClick={() =>  navigator(`/admin/inventory/purchase/${order.id}`, {replace: false})}>
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