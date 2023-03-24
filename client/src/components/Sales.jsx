import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSales, addPay, cancelSale } from "../redux/features/sale.feature.js";
import { F_ } from "../util/Utils.js";
import {Loading } from "./Loading";


export const Sales = () => {
    const dispatch = useDispatch();
    const sales = useSelector((state) => state.sale.sales);
    const [sales_partial, set_sales_partial] = useState([]);
    const loading = useSelector((state) => state.sale.loading);
    const errorMessage = useSelector((state) => state.sale.errorMessage);

    const [sumSales, setSumSales] = useState();
    const [sumNetSales, setSumNetSales] = useState();
    const [sumDueBalances, setSumDueBalances] = useState();

    const [countOpen, setCountOpen] = useState();
    const [countClose, setCountClose] = useState();
    const [countCancelled, setCountCancelled] = useState();

    const paytext = [];

    const paycash =  [];
    const paycc   =  [];
    const [showpaymentbutton, setshowpaymentbutton] = useState([]);
    const [paymenttext, setpaymenttext] = useState([]);
    const [infotextamount, setinfotextamount] = useState([]);

    const p_texts = []
    const showpayments = [];
    const i_texts = [];
    sales.forEach( (s) => {
        paycash[s.id] = React.createRef();
        paycc[s.id] = React.createRef();
        showpayments[s.id] = false;
        paytext[s.id] = React.createRef();
        p_texts[s.id] = 'PAY';
        i_texts[s.id] = '';
    });

    useEffect(() => {
        setshowpaymentbutton(showpayments);
        setpaymenttext(p_texts);
        setinfotextamount(i_texts);
    }, []);
    

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


    const _addPay = (sale_id) => {
        const cash = paycash[sale_id].current?.value;
        const cc = paycc[sale_id].current?.value;
        
        const paids = [];

        if (!isNaN(parseFloat(cash))) {
            paids.push({"amount": cash, "type": 'CASH'});
        }
        if (!isNaN(parseFloat(cc))) {
            paids.push({"amount": cc, "type": 'CC'});
        }

        const data_request = {'paids': paids, 'sale_id': sale_id};
        console.log(data_request);

        dispatch(addPay(data_request));

        paycash[sale_id].current.value = '';
        paycc[sale_id].current.value = '';
        showpayments[sale_id] = false;
        setshowpaymentbutton(showpayments);
    };

    const payMethod = (id, sale_amount) => {
        const cash = paycash[id].current?.value;
        const cc = paycc[id].current?.value;
        const r1 = !isNaN(parseFloat(cash)) ? parseFloat(cash) : 0;
        const r2 = !isNaN(parseFloat(cc)) ? parseFloat(cc) : 0;
        
        if ((r1 + r2) > sale_amount ) {
            console.log('Amount exceded....');
            showpayments[id] = false;
            setshowpaymentbutton(showpayments);
            i_texts[id] = `MONTO EXEDIDO ${(r1 + r2)}`;
            setinfotextamount(i_texts);
            return;
        } else {
            i_texts[id] = '';
            setinfotextamount(i_texts);
        }

        showpayments[id] = (cash > 0 || cc > 0);
        setshowpaymentbutton(showpayments);
        
        p_texts[id] = `PAY: ${r1 + r2}`
        setpaymenttext(p_texts);
    };

    const _cancelSale = (id) => {
        dispatch(cancelSale({id}));
    };

    useEffect(() => {
        const s = sales.reduce((x, sale) => {
            return x + sale.amount
        }, 0);
        const n = sales.reduce((x, sale) => {
            if (sale.invoice_status != 'cancelled') {
                return x + sale.total_paid
            } else {
                return x;
            }
        }, 0);
        const d = s - n;
        setSumSales(s);
        setSumNetSales(n);
        setSumDueBalances(d);

        let open = sales.filter((sale) => { return sale.invoice_status == "open" });
        let close = sales.filter((sale) => { return sale.invoice_status == "close" });
        let cancelled = sales.filter((sale) => { return sale.invoice_status == "cancelled" });
        open = (open != undefined) ? open.length : 0;
        close = (close != undefined) ? close.length : 0;
        cancelled = (cancelled != undefined) ? cancelled.length : 0;

        setCountOpen(open);
        setCountClose(close);
        setCountCancelled(cancelled);

    }, [sales]);

    return (
        <div className="sales-container">
        <div className="sales-grid">
            {loading && <Loading Text="Loading :)" /> }
            {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
            {!loading && sales.length == 0 &&
                <div className="sale-card" >
                    <h2>Nothing to show.</h2>
                </div>
            }
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
                                        {sale.invoice_status == 'open' &&
                                        <div className="sale-total-paid">
                                            <span>{F_(sale.total_paid)}</span>
                                        </div>
                                        }
                                        {sale.invoice_status == 'open' &&
                                        <div className="sale-total-due-balance">
                                            <span>{F_(sale.amount - sale.total_paid)}</span>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="sale-card-paid">
                                    <div>
                                        <span>{sale.login}</span>
                                    </div>
                                 
                                    <div className="pay-input">
                                        {sale.invoice_status == 'open' &&
                                        <span className="material-icons-sharp pay-input-i"> price_check </span>
                                        }
                                        {sale.invoice_status == 'open' &&
                                        <input ref={paycash[sale.id]} type="number"  onChange={() => payMethod(sale.id, sale.amount)}  onFocus={() => payMethod(sale.id, sale.amount)}  className="pay-input-t" />
                                        }
                                    </div>
                                    <div className="pay-input">
                                        {sale.invoice_status == 'open' &&
                                        <span className="material-icons-sharp pay-input-i"> credit_score </span>
                                        }
                                        {sale.invoice_status == 'open' &&
                                        <input ref={paycc[sale.id]}  type="number" onChange={() => payMethod(sale.id, sale.amount)}   onFocus={() => payMethod(sale.id, sale.amount)}  className="pay-input-t"></input>
                                        }
                                    </div>
                                    
                                    <div>
                                        <div>
                                            {
                                            showpaymentbutton[sale.id] && sale.invoice_status == 'open' &&
                                            <button className="cbutton" onClick={() => _addPay(sale.id)}>
                                                <span className="material-icons-sharp"> paid </span>
                                                <span ref={paytext[sale.id]}>{paymenttext}</span>
                                            </button>
                                            }
                                            {
                                            infotextamount[sale.id]  &&
                                                <h2 className="danger">{infotextamount[sale.id]}</h2>
                                            }
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
                                            <th>USER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                    sale.sale_paid.map((paid, iz) => (
                                        <tr key={iz}>
                                            <td>{F_(paid.amount)}</td>
                                            <td>{paid.type}</td>
                                            <td>{paid.date_create}</td>
                                            <td> </td>
                                        </tr>
                                    ))
                                    }
                                        <tr>
                                            <td><b>{F_(sale.total_paid)}</b></td>
                                            <td></td>
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
                                    {sale.invoice_status != 'cancelled' &&
                                    <div>
                                        <button className="cbutton cbutton-red" onClick={() => _cancelSale(sale.id)}>
                                            <span className="material-icons-sharp"> delete_forever </span>
                                            <span>CANCEL</span>
                                        </button>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                )}
        </div>
        <div className="">

            <div className="sales-analytics">
                <h2>Sales Analytics</h2>
                <div className="sales-resume">
                    <div className="info">
                        <h3>{countOpen}</h3>
                        <small className="text-muted"> OPEN </small>
                    </div>
                    <div className="info">
                        <h3>{countClose}</h3>
                        <small className="text-muted"> CLOSE </small>
                    </div>
                    <div className="info">
                        <h3>{countCancelled}</h3>
                        <small className="text-muted"> CANCELLED </small>
                    </div>
                </div>
                <div id="analytics">
                    <div className="item total-sales">
                        <div className="icon">
                            <span className="material-icons-sharp"> currency_exchange </span>
                        </div>
                        <div className="right">
                            <div className="info">
                            <h3>TOTAL SALES</h3>
                            <small className="text-muted"> Last 24 Hours </small>
                            </div>
                            
                            <h3>{F_(sumSales)}</h3>
                        </div>
                        </div><div className="item offline">
                        <div className="icon">
                            <span className="material-icons-sharp"> thumb_up </span>
                        </div>
                        <div className="right">
                            <div className="info">
                            <h3>CLOSE INVOICES</h3>
                            <small className="text-muted"> Last 24 Hours </small>
                            </div>
                            <h5 className="">{Math.round((sumNetSales/sumSales) * 100)}%</h5>
                            <h3>{F_(sumNetSales)}</h3>
                        </div>
                        </div><div className="item customers">
                        <div className="icon">
                            <span className="material-icons-sharp"> thumb_down </span>
                        </div>
                        <div className="right">
                            <div className="info">
                            <h3>DUE BALANCES</h3>
                            <small className="text-muted"> Last 24 Hours </small>
                            </div>
                            <h5 className="danger">{Math.round((sumDueBalances/sumSales) * 100)}%</h5>
                            <h3>{F_(sumDueBalances)}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
};