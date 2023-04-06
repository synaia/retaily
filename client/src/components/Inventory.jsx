import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Inventory = () => {
    const stores = useSelector((state) => state.product.stores);
    const navigator = useNavigate();

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


                { stores.map((st, i) => (
                    <div className="income" onClick={() => navigator(`store/${st.name}`, {replace: true})}>
                        <span className="material-icons-sharp"> done </span>
                        <div className="middle">
                            <div className="left">
                                <h2>{st.name}</h2>
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
                    ))
                }
                
        </div>
    </React.Fragment>
    )
};