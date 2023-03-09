import React from "react";
import { useSelector } from "react-redux";
import { Payment } from "./Payment";
import { Link } from "react-router-dom";
import { F_ } from "../util/Utils";


export const ResumeSaleBox = () => {
    console.log('ResumeSaleBox: rendered.')
    const sale = useSelector((store) => store.product.sale);
    const sale_detail = sale.sale_detail;

    return (
        <Link to="/payment">
        <div className="middle-left-side-terminal">
                <div>
                    <h3>delivery</h3>
                </div>
                <div>
                    <h3>Sub: {F_(sale_detail.sub_total)}</h3>
                </div>
                <div>
                    <h3>Itbis: {F_(sale_detail.sub_tax)}</h3>
                </div>
                <div>
                     <h2>Total: {F_(sale_detail.gran_total)}</h2>
                </div>
            </div>
        </Link>
    );
}

            