import React from "react";

export const Insights = () => {

    return (
        <div className="insights">
            {/* <!-- SALES --> */}
            <div className="sales">
                <span className="material-icons-sharp"> analytics </span>
                <div className="middle">
                    <div className="left">
                    <h3>Total Sales</h3>
                    <h1>$25,024</h1>
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

            {/* <!-- EXPENSES --> */}
            <div className="expenses">
            <span className="material-icons-sharp"> bar_chart </span>
            <div className="middle">
                <div className="left">
                <h3>Total Expenses</h3>
                <h1>$14,160</h1>
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
            <div className="income">
            <span className="material-icons-sharp"> stacked_line_chart </span>
            <div className="middle">
                <div className="left">
                <h3>Total Income</h3>
                <h1>$10,864</h1>
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
    )
};