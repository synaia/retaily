import React, { useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { F_ , R_ } from "../util/Utils";
import { discountTriggerAction } from "../redux/features/product.feature.js";

export const ProductPicked = () => {
    console.log('ProductPicked: rendered.')
    const dispatch = useDispatch();

    const sale = useSelector((store) => store.product.sale);

    const itemsRef =  [];
    sale.products.forEach( (prod) => {
        itemsRef[prod.id] = React.createRef();
    });

    useEffect(() => {
        const product  = sale.products.filter( prod => prod.is_selected == 1 )[0];
        if (product != undefined) {
            itemsRef[product.id].current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    });
    
    const pr_select = (e) => {
        // # clean selection by clicked
        let itemcard = Array.from(document.querySelectorAll('.product-picked'))
        itemcard.forEach(item => item.classList.remove('product-picked-selected'))

        if (Array.from(e.currentTarget.classList).includes('product-picked')) {
            e.currentTarget.classList.add('product-picked-selected')
        } else {
            console.log(e.target)
        }
    }

    const discount = (e) => {
        if (e.keyCode === 13 ) {
            // Trying to move to FocusEvent here.
            document.querySelector('.center-left-side-terminal').focus(); 
        }
        if (e instanceof FocusEvent) {
            dispatch(discountTriggerAction(e));
            return;
        }
    }

    const changePrice = (e) => {
        console.log(e.currentTarget.tagName)
        const input_button = '<input class="change_price_btn small_input_price" type="text" placeholder="nuevo precio" />';
        e.currentTarget.insertAdjacentHTML('afterbegin', input_button);
        let change_price_btn = document.querySelector('.change_price_btn');
        change_price_btn.addEventListener('keydown', discount);
        change_price_btn.addEventListener('focusout', discount);
        change_price_btn.focus();
        let focus_on_text_change_price = true;

        let product_id = change_price_btn.parentNode.dataset.productId;
        const product = sale.products.filter(p => (p.id == product_id))[0];
        change_price_btn.value = product.price_for_sale;
    }

    return (
        <div className="center-left-side-terminal">
            {sale.products.length > 0 && 
            (sale.products.map((product, i) => (
            <div ref={itemsRef[product.id]} key={i}  className={`product-picked ${product.is_selected == 1 ? 'product-picked-selected': ''}`}
                data-product-id={product.id}
                onClick={pr_select} 
                onDoubleClick={changePrice} >
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

