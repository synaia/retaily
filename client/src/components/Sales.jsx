import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";
import { F_ } from "../util/Utils.js";


export const Sales = () => {
    const dispatch = useDispatch();
    const sales = useSelector((state) => state.sale.sales);
    const [sales_partial, set_sales_partial] = useState([]);
    const loading = useSelector((state) => state.sale.loading);
    const errorMessage = useSelector((state) => state.sale.errorMessage);
    

    // useEffect(() => {
    // const data_range = {
    //     init_date: '2023-01-05 00:00:00',
    //     end_date:  '2023-03-05 23:15:55',
    //     invoice_status: 'all',
    //   };
    //     dispatch(loadSales(data_range));
    // }, [dispatch]);

    // useEffect(() => {
    //     set_sales_partial(sales.slice(0, 10));
    //     console.log('useEffect:set_sales_partial:scroll');
    //     const salObject  = document.querySelector('.sales-grid');
    //     let c = 1;
    //     const WINDOW = 300;
    //     salObject.addEventListener('scroll', (event) => {
    //         const y = salObject.scrollTop;
    //         // console.log(y);
    //         if (y > (WINDOW * c)) {
    //             console.log(`y : ${y}`);
    //             c += 1;
    //             set_sales_partial(...sales_partial, sales.slice(0, 10*c));
    //         }
    //     });
    // }, [sales]);

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
            {loading && <div>Loading lalala ;D  .... </div>}
            {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
            {!loading && (
                    sales.map((sale, i)=> (
                        <div className="sale-card" key={sale.id}>
                            <div className={"sale-card-" + sale.invoice_status}></div>
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
                                <div className="sale-card-paid">
                                    <div>
                                        <span>{sale.login}</span>
                                    </div>
                                    <div>
                                        <div>
                                            <button className="cbutton">
                                                <span className="material-icons-sharp"> paid </span>
                                                <span>PAY</span>
                                            </button>
                                        </div>
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
                                        <tr key={ix}>
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
                                        <tr key={iz}>
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
                                    <div>
                                        <button className="cbutton">
                                            <span className="material-icons-sharp"> print </span>
                                            <span>RE-PRINT</span>
                                        </button>
                                    </div>
                                    <div>
                                        <button className="cbutton cbutton-red">
                                            <span className="material-icons-sharp"> delete_forever </span>
                                            <span>CANCEL</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
        </div>
    )
};