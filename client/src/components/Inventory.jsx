import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStoresInv, addStore } from "../redux/features/product.feature.js";
import { F_, validateInputX } from "../util/Utils";
import { SCOPES } from "../util/constants";

export const Inventory = () => {
    const count_resume = useSelector((state) => state.product.count_resume);
    const currentUser = useSelector((state) => state.user.currentUser);

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
        {currentUser &&
            <div className="insights">
                {currentUser.scopes.includes(SCOPES.PRODUCT.VIEW) &&
                <div className="inventory-resume " onClick={() => navigator(`products/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp inv-success"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Products</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.PRODUCT.PRICELIST) &&
                <div className="inventory-resume" onClick={() => navigator(`pricelist/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp inv-success"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Price List</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.PRODUCT.ADD) &&
                <div className="inventory-resume" onClick={() => navigator(`newproduct/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp inv-success"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>New Product</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.STORES) &&
                <div className="inventory-resume" onClick={() => navigator(`store/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Store List</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.MOVEMENT.REQUEST) &&
                <div className="inventory-resume" onClick={() => navigator(`storemov/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Request: Inventory Mov</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.MOVEMENT.RESPONSE) &&
                <div className="inventory-resume" onClick={() => navigator(`storemovresp/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Response: Inventory Mov.</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.BULK) &&
                <div className="inventory-resume" onClick={() => navigator(`bulklist/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Bulk New</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.PURCHASE.REQUEST) &&
                <div className="inventory-resume" onClick={() => navigator(`purchase/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Purchases Orders</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.PURCHASE.RESPONSE) &&
                <div className="inventory-resume" onClick={() => navigator(`purchaseresp/`, {replace: false})}  >
                    <div className="icon">
                        <span className="material-icons-sharp"> layers </span>
                    </div>
                    <div className="inventory-resume-r">
                        <div className="inventory-resume-c">
                            <div className="info">
                                <h3>Receive: Purchases Orders</h3>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        }
    </React.Fragment>
    )
};