import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSales, addPay, updatePayInListAction } from "../redux/features/sale.feature.js";
import { F_ } from "../util/Utils.js";


export const Sales = () => {
    const dispatch = useDispatch();
    const sales = useSelector((state) => state.sale.sales);
    const [sales_partial, set_sales_partial] = useState([]);
    const loading = useSelector((state) => state.sale.loading);
    const errorMessage = useSelector((state) => state.sale.errorMessage);

    const paytext = [];

    const paycash =  [];
    const paycc   =  [];
    const [showpaymentbutton, setshowpaymentbutton] = useState([]);
    const [paymenttext, setpaymenttext] = useState([]);
    const p_texts = []
    const showpayments = [];
    sales.forEach( (s) => {
        paycash[s.id] = React.createRef();
        paycc[s.id] = React.createRef();
        showpayments[s.id] = false;
        paytext[s.id] = React.createRef();
        p_texts[s.id] = 'PAY';
    });

    useEffect(() => {
        setshowpaymentbutton(showpayments);
        setpaymenttext(p_texts);
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

    const payMethod = (id) => {
        const cash = paycash[id].current?.value;
        const cc = paycc[id].current?.value;
        showpayments[id] = (cash > 0 || cc > 0);
        setshowpaymentbutton(showpayments);
        const r1 = !isNaN(parseFloat(cash)) ? parseFloat(cash) : 0;
        const r2 = !isNaN(parseFloat(cc)) ? parseFloat(cc) : 0;
        setpaymenttext(`PAY: ${r1 + r2}`);

        // paytext[id].current?.value = `PAY: ${cash + cc}`;
    }

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
                                 
                                    <div className="pay-input">
                                        {sale.invoice_status == 'open' &&
                                        <span className="material-icons-sharp pay-input-i"> price_check </span>
                                        }
                                        {sale.invoice_status == 'open' &&
                                        <input ref={paycash[sale.id]} type="number"  onChange={() => payMethod(sale.id)}  onFocus={() => payMethod(sale.id)}  className="pay-input-t" />
                                        }
                                    </div>
                                    <div className="pay-input">
                                        {sale.invoice_status == 'open' &&
                                        <span className="material-icons-sharp pay-input-i"> credit_score </span>
                                        }
                                        {sale.invoice_status == 'open' &&
                                        <input ref={paycc[sale.id]}  type="number" onChange={() => payMethod(sale.id)}   onFocus={() => payMethod(sale.id)}  className="pay-input-t"></input>
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