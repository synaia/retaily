import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { F_ } from "../util/Utils";
import { lang } from "../common/spa.lang.js";

export const Insights = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const {total_sale, total_promise, total_income} = useSelector((state) => state.product.sales_totals);

    return (
        <div className="insights">
            {/* <!-- SALES --> */}
            <div className="sales">
                <span className="material-icons-sharp"> analytics </span>
                <div className="middle">
                    <div className="left">
                    <h3>{lang.dashboard.total_sales}</h3>
                    <h1>{F_(total_sale)}</h1>
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
                <small className="text-muted"> {lang.dashboard.on_the_running_day} </small>
            </div>

            {/* <!-- EXPENSES --> */}
            <div className="expenses">
            <span className="material-icons-sharp"> bar_chart </span>
            <div className="middle">
                <div className="left">
                <h3>{lang.dashboard.total_due}</h3>
                <h1>{F_(total_promise - total_sale)}</h1>
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
            <small className="text-muted">  {lang.dashboard.on_the_running_day} </small>
            </div>

            {/* <!-- INCOME --> */}
            <div className="income">
            <span className="material-icons-sharp"> stacked_line_chart </span>
            <div className="middle">
                <div className="left">
                <h3>{lang.dashboard.total_income}</h3>
                <h1>{F_(total_income)}</h1>
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
            <small className="text-muted"> {lang.dashboard.on_the_running_day} </small>
            </div>
      </div>
    )
};