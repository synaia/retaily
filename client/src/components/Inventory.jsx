import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStoresInv, addStore } from "../redux/features/product.feature.js";
import { F_, validateInputX } from "../util/Utils";

export const Inventory = () => {
    const inventory_head_list = useSelector((state) => state.product.inventory_head_list);
    const resume_inv = useSelector((state) => state.product.resume_inv);
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const store_name = useRef();
    const [errorStoreName, SeterrorStoreName] = useState(null);


    useEffect(() => {
        dispatch(getStoresInv());
    }, []);

    useEffect(() => {
        console.log(resume_inv['LOPE'])
    }, [resume_inv]);

    const __addStore = () => {
        if (!validateInputX(store_name, "str", SeterrorStoreName)) {
            return;
        }
        const args = store_name.current?.value;
        dispatch(addStore(args));
    };

    return (
        <React.Fragment>
            <div className="insights">
                {/* <!-- SALES --> */}
                <div className="sales" onClick={() => navigator('products', {replace: true})}>
                    <span className="material-icons-sharp"> analytics </span>
                    <div className="middle">
                        <div className="left">
                            <h2>PRODUCTS</h2>
                            <h3>$25,024</h3>
                        </div>
                        <div className="progress">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="number">
                                <p>81%</p>
                            </div>
                        </div>
                    </div>
                    <small className="text-muted"> Last 24 hours </small>
                </div>

                <div className="expenses"  onClick={() => navigator('pricelist', {replace: true})}>
                    <span className="material-icons-sharp"> bar_chart </span>
                        <div className="middle">
                            <div className="left">
                                <h2>PRICE LIST</h2>
                                <h3>$14,160</h3>
                            </div>
                            <div className="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="number">
                                    <p>62%</p>
                                </div>
                            </div>
                        </div>
                    <small className="text-muted"> Last 24 hours </small>
                </div>

                {/* <!-- INCOME --> */}
                <div className="income" onClick={() => navigator('newproduct', {replace: true})}>
                    <span className="material-icons-sharp"> stacked_line_chart </span>
                    <div className="middle">
                        <div className="left">
                            <h2>ADD PRODUCT</h2>
                            <h3>$10,864</h3>
                        </div>
                        <div className="progress">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div className="number">
                                <p>44%</p>
                            </div>
                        </div>
                    </div>
                    <small className="text-muted"> Last 24 hours </small>
                </div>

                <div className="wide-box">
                    <h2>Stores</h2>
                    <div>
                        <p>STORE NAME</p>
                        <div className="price-list-b">
                            <p className="material-icons-sharp price-list-i"> edit_note </p>
                            <input ref={store_name} type="text" className="price-list-t" />
                            <p className="underline-animation"></p>
                        </div>
                            <p className="error-msg">{errorStoreName}</p>
                        </div>
                    <button className="fbutton fbutton-price-list" onClick={() => __addStore()}>
                        <p className="material-icons-sharp"> add_business </p>
                        <h3>CREATE STORE</h3>
                    </button>
                </div>


                { inventory_head_list.map((head, i) => (
                    <div className="inventory-resume" key={i} onClick={() => navigator(`store/${head.store.name}`, {replace: true})}>
                        <div className="icon">
                        {head.name != undefined &&
                                <span className="material-icons-sharp inv-in-progress"> storefront </span>
                        }
                        {head.name == undefined &&
                                <span className="material-icons-sharp inv-success"> storefront </span>
                        }
                        </div>
                        <div className="inventory-resume-r">
                            <div className="inventory-resume-c">
                                <div className="info">
                                    <h3>{head.store.name}</h3>
                                    <small className="text-muted"> Store </small>
                                </div>
                                <div className="info">
                                    <h3>{F_(resume_inv[head.store.name].inv_valuation)}</h3>
                                    <small className="text-muted"> Value Inventory </small>
                                </div>
                            </div>
                            {head.name != undefined &&
                                <div className="inventory-resume-c">
                                    <div className="info">
                                        <h3>In Progress</h3>
                                        <small className="text-muted"> Status </small>
                                    </div>
                                    <div className="info">
                                        <h3>{resume_inv[head.store.name].changed_count}</h3>
                                        <small className="text-muted"> Products Changed </small>
                                    </div>
                                </div>
                            }
                            {head.name != undefined &&
                                <div className="inventory-resume-c">
                                    <div className="info">
                                        <h3 className="name-inv">{head.name}</h3>
                                        <small className="text-muted"> Name </small>
                                    </div>
                                    <div className="info">
                                        <h3>{F_(resume_inv[head.store.name].inv_valuation_changed)}</h3>
                                        <small className="text-muted"> Value Changed </small>
                                    </div>
                                </div>
                            }
                        </div>
                       
                        {/* <div className="middle">
                            <div className="left">
                                <h2>{head.store.name}</h2>
                                <h3>Current Inv: {head.name}</h3>
                                <h3>Products Changed: {resume_inv[head.store.name].changed_count}</h3>
                                <h3>inv_valuation_changed: {resume_inv[head.store.name].inv_valuation_changed}</h3>
                                <h3>inv_valuation: {resume_inv[head.store.name].inv_valuation}</h3>
                            </div>
                            <div className="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="number">
                                    <p>44%</p>
                                </div>
                            </div>
                        </div>
                        <small className="text-muted"> Last 24 hours </small> */}
                    </div>
                    ))
                }
                
        </div>
    </React.Fragment>
    )
};