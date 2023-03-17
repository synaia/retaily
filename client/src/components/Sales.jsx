import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";
import { F_ } from "../util/Utils.js";


export const Sales = () => {
    const dispatch = useDispatch();
    const [sales_partial, set_sales_partial] = useState([]);
    const saleState = useSelector((state) => state.sale);
    const {loading, errorMessage, sales} = saleState;

    // useEffect(() => {
    //     const data_range = {
    //         init_date: '2023-01-01 00:00:00',
    //         end_date:  '2023-02-10 10:15:55'
    //     };
    //     dispatch(loadSales(data_range));
    // }, [dispatch]);

    useEffect(() => {
        set_sales_partial(sales.slice(0, 10));
        console.log('useEffect:set_sales_partial:scroll');
        const salObject  = document.querySelector('.sales-grid');
        let c = 1;
        const WINDOW = 200;
        salObject.addEventListener('scroll', (event) => {
            const y = salObject.scrollTop;
            // console.log(y);
            if (y > (200 * c)) {
                console.log(`y : ${y}`);
                c += 1;
                set_sales_partial(...sales_partial, sales.slice(0, 10*c));
            }
        });
    }, [sales]);

    useEffect(() => {
        // Change Theme
        const themeToggler = document.querySelector(".theme-toggler");
        themeToggler.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme-variables");
            themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
            themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
        });
    });

    return (
        <div className="sales-grid">
            <h1>Sales</h1>
            {loading && <div>Loading lalala ;D  .... </div>}
            {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
            {!loading && (
                    sales_partial.map((sale, i)=> (
                        <div className="sale-card" key={i}>
                            <div>
                                {sale.invoice_status}
                            </div>
                            <div className="sale-card-content">
                                <div className="sale-card-head">
                                    <div>
                                        <div>
                                            <span>{sale.client.name} {sale.client.celphone}</span>
                                        </div>
                                        <div>
                                            <span>{sale.sequence}  {sale.date_create}</span>
                                        </div>
                                    </div>
                                    <div className="sale-card-amounts">
                                        <div className="sale-total-amount">
                                            <span>{F_(sale.amount)}</span>
                                        </div>
                                        <div className="sale-total-paid">
                                            <span>{F_(sale.total_paid)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="sale-card-head">
                                    <div>
                                        <span>{sale.login}</span>
                                    </div>
                                    <div>
                                        <button>Pagar</button>
                                    </div>
                                </div>
                                <div className="sale-card-lines">
                                  <table className="sale-card-table">
                                    <thead>
                                        <tr>
                                            <th>PRODUCT</th>
                                            <th></th>
                                            <th>SUB TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                    sale.sale_line.map((line, ix) => (
                                        <tr>
                                            <td>{line.product.name}</td>
                                            <td>{line.quantity} x {line.amount - (line.discount/line.quantity)}</td>
                                            <td>{F_(line.total_amount)}</td>
                                        </tr>
                                    ))
                                    }
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td><b>{F_(sale.amount)}</b></td>
                                        </tr>
                                    </tbody>
                                  </table>
                                  
                                  <table className="sale-card-table">
                                    <thead>
                                        <tr>
                                            <th>AMOUNT</th>
                                            <th>TYPE</th>
                                            <th>DATE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                    sale.sale_paid.map((paid, iz) => (
                                        <tr>
                                            <td>{F_(paid.amount)}</td>
                                            <td>{paid.type}</td>
                                            <td>{paid.date_create}</td>
                                        </tr>
                                    ))
                                    }
                                        <tr>
                                            <td><b>{F_(sale.total_paid)}</b></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="sale-card-btns">
                                    <div>RE-PRINT</div>
                                    <div>CANCEL</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
        </div>
    )
};