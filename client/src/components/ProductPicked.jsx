import React, { useEffect, useLayoutEffect } from "react";
import { useAPI } from "../context/app-context";
import { N_ } from "../util/Utils";

export const ProductPicked = () => {
    console.log('ProductPicked: rendered.')
    const { sale, setSale, updateTSaleDetails } = useAPI()

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

    const shake = (target) => {
        target.classList.add('shake')
        const _shake = async () => {
            await setTimeout( () => {
                target.classList.remove('shake')
            }, 500)
        }
        return _shake()
    }              

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

    const discountTrigger = (e) => {
        if (e.keyCode === 13 | e instanceof FocusEvent) {
            const prods = sale.products;
            let product_id = e.currentTarget.parentNode.dataset.productId
            let new_value = e.currentTarget.value.trim()

            const current_index = prods.findIndex(p => (p.id == product_id))

            if (prods[current_index].price_for_sale == new_value) {
                console.log('No changes on new value ....')
                e.stopPropagation()
                try {
                    e.currentTarget.remove()
                } catch (err) {
                    console.log(err)
                }
                return 
            }

            const reg_percentage = /^(\d+(?:\.\d+)?%|0%)$/
            const reg_number     = /^(\d+(?:\.\d+)?)$/
            const match_number   = /(\d+(?:\.\d+)?)/

            if (!(reg_percentage.test(new_value) || reg_number.test(new_value)) ) {
                const currentTarget = e.currentTarget
                shake(currentTarget)

                console.log('No percentage No number ....')

                e.currentTarget.value = prods[current_index].price_for_sale
                e.stopPropagation()
                return 
            }

            if (reg_percentage.test(new_value)) {
                new_value = Number(new_value.match(match_number)[0]);
                console.log('% discount', new_value)
                const pr_price = prods[current_index].price
                console.log('pr_price', pr_price)
                new_value = pr_price - ((pr_price/100) * new_value)
                console.log('new_value', new_value)
                if (new_value < 0) {
                    const currentTarget = e.currentTarget
                    shake(currentTarget)
                    console.log('Negative value not admited ....')
                    e.currentTarget.value = prods[current_index].price_for_sale
                    e.stopPropagation()
                    return 
                }
            } else {
                new_value = Number(new_value)
            }
            
            const discount = (prods[current_index].price - new_value) * prods[current_index].inventory.quantity_for_sale
            prods[current_index].price_for_sale = new_value
            prods[current_index].discount = discount

            // rayos
            const discount_percent = ((discount / prods[current_index].price) / prods[current_index].inventory.quantity_for_sale) * 100

            prods[current_index].discount_percent = discount_percent


            const sale_detail = updateTSaleDetails(prods)

            setSale({...sale, 'products': prods, 'sale_detail': sale_detail});

            try {
                e.currentTarget.remove()
            } catch (err) {
                console.log(err)
            }
        }
    }

    const you_dbclick = (e) => {
        console.log(e.currentTarget.tagName)
        const input_button = '<input class="change_price_btn small_input_price" type="text" placeholder="nuevo precio" />'
        e.currentTarget.insertAdjacentHTML('afterbegin', input_button)
        let change_price_btn = document.querySelector('.change_price_btn')
        change_price_btn.addEventListener('keydown',  discountTrigger)
        change_price_btn.addEventListener('focusout', discountTrigger)
        change_price_btn.focus()
        let focus_on_text_change_price = true

        let product_id = change_price_btn.parentNode.dataset.productId
        const product = sale.products.filter(p => (p.id == product_id))[0]
        change_price_btn.value = product.price_for_sale
    }

    return (
        // <div className="inbox">
        //     {sale.products.length > 0 && 
        //     (sale.products.map((product, i) => (
        //     <div ref={itemsRef[product.id]} key={i} 
        //          className={`tile is-child notification is-success itemcard ${product.is_selected == 1 ? 'itemcard_selected': ''}`} 
        //          data-product-id={product.id}
        //          onClick={pr_select} 
        //          onDoubleClick={you_dbclick} >
        //         <p className="text_row">{product.name}</p>
        //         <span className="resume">
        //             {product.inventory.quantity_for_sale} X {N_(product.price_for_sale)}
        //         </span>
        //         <span className="discount">
        //         {(product.discount != undefined && product.discount > 0) && <b>  (-{N_((product.inventory.quantity_for_sale * product.price)  -  (product.inventory.quantity_for_sale * product.price_for_sale))}) or -{N_(product.discount_percent)}%  </b>}
        //         </span>
        //         {(product.discount != undefined && product.discount > 0) && <span className="und"> {N_(product.inventory.quantity_for_sale * product.price)}</span>}
        //         <span className="total">{N_(product.inventory.quantity_for_sale * product.price_for_sale)}</span>
        //     </div>
        //     )))}
        // </div>


<div className="center-left-side-terminal">
            {sale.products.length > 0 && 
            (sale.products.map((product, i) => (
            <div ref={itemsRef[product.id]} key={i}  className={`product-picked ${product.is_selected == 1 ? 'product-picked-selected': ''}`}
                data-product-id={product.id}
                onClick={pr_select} 
                onDoubleClick={you_dbclick} >
                <div className="product-picked-label">
                    <h3>{product.name}</h3>
                </div>
                <div className="dicount">
                    {(product.discount != undefined && product.discount > 0) && <h3>  (-{N_((product.inventory.quantity_for_sale * product.price)  -  (product.inventory.quantity_for_sale * product.price_for_sale))}) or -{N_(product.discount_percent)}%  </h3>}
                </div>
                <div className="original-price">
                    {(product.discount != undefined && product.discount > 0) && <h3>{N_(product.inventory.quantity_for_sale * product.price)}</h3>}
                </div>
                <div className="total-tags">
                    <div className="quantity-tag">
                        <h3>{product.inventory.quantity_for_sale} X {N_(product.price_for_sale)}</h3>
                    </div>
                    <div className="sub-tag">
                        <h3>{N_(product.inventory.quantity_for_sale * product.price_for_sale)}</h3>
                    </div>
                </div>
            </div>
            )))}
        </div>


    );
}

