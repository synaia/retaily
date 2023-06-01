import React from "react";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { ProductPickedReadOnly } from "./ProductPickedReadOnly";
import { F_ } from "../util/Utils";
import { useSelector, useDispatch } from "react-redux";
import { addSale } from "../redux/features/sale.feature.js";
import { useRef, useState } from "react";



export const Payment = () => {
    const sale = useSelector((store) => store.product.sale);
    const sequences = useSelector((store) => store.sale.sequences);
    const dispatch = useDispatch();
    const sale_detail = sale.sale_detail;
    const paidForm = useRef();
    const amountCash = useRef();
    const amountCC = useRef();
    const [status, setStatus] = useState('CASH');
    const [type, setType] = useState('IN_SHOP');
    const [seqType, setSeqType] = useState("DV");
    const [showPaymentBtn,  setShowPaymentBtn] = useState(false);
    const [amountTyped, setAmountTyped] = useState();
    const [amountDiff, setAmountDiff] = useState();

    console.log('Payment: rendered.')

    const payButton = () => {
        const sx = {...sale};

        sx.sequence_type = seqType;
        sx.status = status;
        sx.sale_type = type;
        let paids = [];

        if ("CREDIT" != status) {
            if (parseFloat(amountCash.current.value)) {
                paids.push( 
                    {
                        'amount': amountCash.current.value,
                        'type': 'CASH',
                    }
                )
            }

            if (parseFloat(amountCC.current.value)) {
                paids.push( 
                    {
                        'amount': amountCC.current.value,
                        'type': 'CC',
                    }
                )
            }
        }
        
        sx.paids = paids;

        console.log(sx);

        // dispatch(addSale(sx));
    }

    const onPaymentStatusChange = (event) => {
        const radio = event.currentTarget;
        console.log(radio.value)
        setStatus(radio.value);
        if ("CREDIT" == radio.value) {
            paidForm.current.classList.add('hidde-paid-form');
        } else {
            paidForm.current.classList.remove('hidde-paid-form');
        }
    }

    const onPaymentTypeChange = (event) => {
        const radio = event.currentTarget;
        setType(radio.value);
    }

    const onPaymentSeqTypeChange = (event) => {
        const radio = event.currentTarget;
        setSeqType(radio.value);
    }

    const onAmountChange = (total_amount) => {
        const cash = !isNaN(parseFloat(amountCash.current.value)) ? parseFloat(amountCash.current.value) : 0;
        const cc = !isNaN(parseFloat(amountCC.current.value)) ? parseFloat(amountCC.current.value) : 0;
        setAmountTyped(cash + cc);
        setAmountDiff((cash + cc) - total_amount);

        if ((cash + cc) >= total_amount) {
            console.log('Jepppppp!!!')
            setShowPaymentBtn(true);
            return;
        } 

        if ((cash + cc) < total_amount) {
            console.log('Not yet')
            setShowPaymentBtn(false);
            return;
        }

        if ((cash + cc) == total_amount) {
            
        }
    }

    return (

        <div className="container-pay">
            <div className="left-side-client">
                <Link to='/'>
                    <div className="top-left-side-pay">
                        <span className="material-icons-sharp" >
                        keyboard_return
                    </span>
                        <h2>return </h2>
                    </div>
                </Link>
                
                <ProductPickedReadOnly />

                <div className="bottom-left-side">
                    
                </div>

            </div>

            <main>
                <Header />
                
                <div className="product-grid-frm ">
                    <div className="invoice-to">
                        {sale.client == null  && <h1>YOU SUPPOSED TO PICK A CLIENT BEFORE ...</h1>}
                        {sale.client != null  && <h1>Invoiced to: {sale.client.name}</h1>}
                    </div>
                    <div>
                         {sale.client != null  && <h2>Address: {sale.client?.address}</h2>}
                    </div>
                    <div>
                         {sale.client != null  && <h2>Phone: {sale.client?.celphone}</h2>}
                    </div>

                    <div className="payment-btns">
                        <div className="switch-field">
                            <input type="radio" id="switch_left" name="status" value="CASH" defaultChecked={true}  onChange={onPaymentStatusChange}/>
                            <label for="switch_left">CASH</label>
                            <input type="radio" id="switch_right" name="status" value="CREDIT" onChange={onPaymentStatusChange} className="credit-radio"/>
                            <label for="switch_right">CREDIT</label>
                        </div>

                        <div className="switch-field">
                            <input type="radio" id="switch_left_d" name="sale_type" value="IN_SHOP"  defaultChecked={true}  onChange={onPaymentTypeChange} />
                            <label for="switch_left_d">IN STORE</label>
                            <input type="radio" id="switch_right_l" name="sale_type" value="FOR_DELIVER" className="credit-radio" onChange={onPaymentTypeChange}/>
                            <label for="switch_right_l">FOR DELIVERY</label>
                        </div>

                        <div className="select-div select-seq">
                            <select className="select-from-store" onChange={onPaymentSeqTypeChange}>
                                { sequences.map((s, i) => (
                                    <option key={i} value={s.code}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    

                    <div className="sale-card-paid-form" ref={paidForm}> 
                        <div className="pay-input-frm">
                            <span className="material-icons-sharp pay-input-i-frm"> price_check </span>
                            <input  type="number"  className="pay-input-t-frm" ref={amountCash} onChange={() => onAmountChange(sale.sale_detail.gran_total)} />
                        </div>
                        <div className="pay-input-frm">
                            <span className="material-icons-sharp pay-input-i-frm"> credit_score </span>
                            <input  type="number" className="pay-input-t-frm" ref={amountCC} onChange={() => onAmountChange(sale.sale_detail.gran_total)} /> 
                        </div>
                        <div className="pay-input-frm">
                            {showPaymentBtn &&
                            <span className="material-icons-sharp pay-input-i-frm"> check </span>
                            }
                            <span className="pay-input-t-typed">{amountTyped}</span>
                        </div>
                            
                        <div className="info-pay">
                                <h3>{amountDiff}</h3>
                        </div>
                    </div>

                   

                    <div className="middle-left-side-pay" onClick={payButton}>
                        <div>
                            <h3>DELIVERY</h3>
                        </div>
                        <div>
                            <h3>DISCOUNTS: {F_(sale_detail.discount_total)}</h3>
                        </div>
                        <div>
                            <h3>SUB: {F_(sale_detail.sub_total)}</h3>
                        </div>
                        <div>
                            <h3>ITBIS: {F_(sale_detail.sub_tax)}</h3>
                        </div>
                        <div></div>
                        <div>
                            <h2>TOTAL: {F_(sale_detail.gran_total)}</h2>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}