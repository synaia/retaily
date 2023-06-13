import React, { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { F_, R_ } from "../util/Utils";

export const ProductPickedReadOnly = () => {
    console.log('ProductPickedReadOnly: rendered.')
    const sale = useSelector((store) => store.product.sale);

    return (
        <div className="center-left-side-pay">
            {sale.products.length > 0 && 
            (sale.products.map((product, i) => (
            <div key={i}  className={`product-picked`}
                data-product-id={product.id} >
                <div className="product-picked-label">
                    <h3>{product.name}</h3>
                </div>
                <div className="dicount">
                    {(product.discount != undefined && product.discount > 0) && <> <h3 className="product-card-top-l">-{R_(product.discount_percent)}%</h3> <h3>  (-{F_((product.inventory[0].quantity_for_sale * product.price)  -  (product.inventory[0].quantity_for_sale * product.price_for_sale))}) </h3> </>}
                </div>
                <div className="original-price">
                    {(product.discount != undefined && product.discount > 0) && <h3>{F_(product.inventory[0].quantity_for_sale * product.price)}</h3>}
                </div>
                <div className="total-tags">
                    <div className="quantity-tag">
                        <h3>{product.inventory[0].quantity_for_sale} X {F_(product.price_for_sale)}</h3>
                    </div>
                    <div className="sub-tag">
                        <h3>{F_(product.inventory[0].quantity_for_sale * product.price_for_sale)}</h3>
                    </div>
                </div>
            </div>
            )))}
        </div>
    );
}

