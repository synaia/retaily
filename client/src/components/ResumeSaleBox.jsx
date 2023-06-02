import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Payment } from "./Payment";
import { useNavigate } from "react-router-dom";
import { F_ } from "../util/Utils";
import { redirect_pass } from "../redux/features/sale.feature.js";


export const ResumeSaleBox = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    console.log('ResumeSaleBox: rendered.')
    const sale = useSelector((store) => store.product.sale);
    const sale_detail = sale.sale_detail;


    const onClickToPay = () => {
        if (sale.products.length == 0) return;

        if (sale.client != null) {
            navigator('/payment', {replace: false});
        } else {
            dispatch(redirect_pass(true));
            navigator('/client', {replace: false});
        }
    }

    return (
        <div className="middle-left-side-terminal" onClick={onClickToPay}>
                <div>
                    <h3>SUB: {F_(sale_detail.sub_total)}</h3>
                </div>
                <div>
                     <h2>TOTAL: {F_(sale_detail.gran_total)}</h2>
                </div>
                <div>
                    <h3>DELIVERY {F_(0)}</h3>
                </div>
                <div>
                    <h3>DISCOUNTS: {F_(sale_detail.discount_total)}</h3>
                </div>
                <div>
                    <h3>ITBIS: {F_(sale_detail.sub_tax)}</h3>
                </div>
            </div>
    );
}

            