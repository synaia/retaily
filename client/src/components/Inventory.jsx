import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStoresInv, addStore } from "../redux/features/product.feature.js";
import { F_, validateInputX } from "../util/Utils";

export const Inventory = () => {
    const count_resume = useSelector((state) => state.product.count_resume);

    const inventory_head_list = useSelector((state) => state.product.inventory_head_list);
    const resume_inv = useSelector((state) => state.product.resume_inv);
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const store_name = useRef();
    const [errorStoreName, SeterrorStoreName] = useState(null);


    const getStatusIcon = (date_create) => {
        if (date_create != undefined) {
            const currentDate = new Date();
            const dc = new Date(date_create);
            const days_back = currentDate.getDate() - dc.getDate();
            if (days_back == 0) {
                return "";
            } else if (days_back >= 1 && days_back <= 2 ) {
                return "sentiment_very_dissatisfied";
            } else if (days_back >= 3 ) {
                return "local_fire_department";
            }
        } else {
            return "";
        }
    }

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
            <div className="inventory-bar">
                <button className="fbutton-inventory fbutton-green" onClick={() => navigator(`store/`, {replace: false})} 
                        data-invoice-status="all">
                    <span className="material-icons-sharp"> layers </span>
                        <span>Store List</span>
                </button>
                <button className="fbutton-inventory fbutton-orange" onClick={() => navigator(`storemov/`, {replace: false})}  
                        data-invoice-status="open">
                        <span className="material-icons-sharp"> layers </span>
                        <span>Request: Inventory Mov.</span>
                </button>
                <button className="fbutton-inventory fbutton-purple" onClick={() => navigator(`storemovresp/`, {replace: false})} 
                        data-invoice-status="close">
                        <span className="material-icons-sharp"> layers </span>
                        <span>Response: Inventory Mov.</span>
                </button>
                <button className="fbutton-inventory fbutton-red" onClick={() => navigator(`purchase/`, {replace: false})} 
                        data-invoice-status="close">
                        <span className="material-icons-sharp"> layers </span>
                        <span>Purchases Orders</span>
                </button>
            </div>

            <div className="insights">
                {/* <!-- SALES --> */}
                <div className="sales" onClick={() => navigator('products', {replace: false})}>
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

                <div className="expenses"  onClick={() => navigator('pricelist', {replace: false})}>
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
                <div className="income" onClick={() => navigator('newproduct', {replace: false})}>
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
        </div>
    </React.Fragment>
    )
};