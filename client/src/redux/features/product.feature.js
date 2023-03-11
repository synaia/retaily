/**
 * @file product-list.feature.js
 * @author Wilton Beltre
 * @description  drive in a centralized way all about product methods and remote connection with backend.
 * @version 1.0.0
 * @license MIT 
 */
import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOKEN, STORE, BACKEND_HOST } from "../../util/constants";
import { storeInfo } from "../../common/store-info";

const initialState = {
    loading: false,
    products: [],
    products_reshape: [[]],
    sale: {
        'client': null, 
        'products': [], 
        'sale_detail': {
            'gran_total': 0, 
            'sub_total': 0, 
            'sub_tax': 0
        }
    },
    errorMessage: null
};

export const loadProducts = createAsyncThunk('products/loadProducts', async () => {
    console.log('loadProducts...');
    let response = await Axios.get(`${BACKEND_HOST}/products/`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});

const updateSaleDetail = (productPickedList) => {
    const gran_total = productPickedList.reduce((x, p) => {
        return (x + (p.price_for_sale * p.inventory.quantity_for_sale));
    }, 0);

    const sub_total = gran_total / (1 + storeInfo.tax);
    const sub_tax = sub_total * storeInfo.tax;
    const sale_detail = {'gran_total': gran_total, 'sub_total': sub_total, 'sub_tax': sub_tax};
    return sale_detail;
};

const pickProduct = (state, action) => {
    const productId = action.payload;
    const productAvailableList = state.products;
    const productPickedList = [...state.sale.products];
    const productPicked = {...productAvailableList.filter( prod => prod.id == productId )[0]};
    const productExist  = productPickedList.filter( prod => prod.id == productPicked.id )[0];

    productPickedList.forEach(prod => { prod.is_selected = 0; });

    if (productExist != undefined) {
        let index = productPickedList.findIndex(prod => prod.id == productPicked.id);
        productPickedList[index].inventory.quantity_for_sale += 1;
        productPickedList[index].is_selected = 1;
    } else {
        productPicked.is_selected = 1;
        productPickedList.push(productPicked);
    }

    const sale_detail = updateSaleDetail(productPickedList);
    state.sale.products = productPickedList;
    state.sale.sale_detail = sale_detail;
};

const kickProduct = (state, action) => {
    const productId = action.payload;
    const products = [...state.sale.products];
    const index = products.findIndex(prod => prod.id == productId);
    products.splice(index, 1);
    const sale_detail = updateSaleDetail(products);
    state.sale.products = products;
    state.sale.sale_detail = sale_detail;
};

const reduceProduct = (state, action) => {
    const productId = action.payload;
    const products = [...state.sale.products];
    const index = products.findIndex(prod => prod.id == productId);
    if (products[index].inventory.quantity_for_sale == 1) {
        kickProduct(state, action);
        return;
    } else {
        products[index].inventory.quantity_for_sale -= 1;
        products[index].is_selected = 1;
        const sale_detail = updateSaleDetail(products);
        state.sale.products = products;
        state.sale.sale_detail = sale_detail;
    }
};

const shake = (target) => {
    target.classList.add('shake')
    const _shake = async () => {
        await setTimeout( () => {
            target.classList.remove('shake')
        }, 500)
    }
    return _shake()
};

const discountTrigger = (state, action) => {
    const e = action.payload;
    const products = [...state.sale.products];
    let product_id = e.currentTarget.parentNode.dataset.productId;
    let new_value = e.currentTarget.value.trim();

    const current_index = products.findIndex(p => (p.id == product_id));

    if (products[current_index].price_for_sale == new_value) {
        console.log('No changes on new value ....');
        e.stopPropagation();
        try {
            e.currentTarget.remove();
        } catch (err) {
            console.log(err);
        }
        return ;
    }

    const reg_percentage = /^(\d+(?:\.\d+)?%|0%)$/;
    const reg_number     = /^(\d+(?:\.\d+)?)$/;
    const match_number   = /(\d+(?:\.\d+)?)/;

    if (!(reg_percentage.test(new_value) || reg_number.test(new_value)) ) {
        const currentTarget = e.currentTarget;
        shake(currentTarget);

        console.log('No percentage No number ....');

        e.currentTarget.value = products[current_index].price_for_sale;
        e.stopPropagation();
        return ;
    }

    if (reg_percentage.test(new_value)) {
        new_value = Number(new_value.match(match_number)[0]);
        console.log('% discount', new_value);
        const pr_price = products[current_index].price;
        console.log('pr_price', pr_price);
        new_value = pr_price - ((pr_price/100) * new_value);
        console.log('new_value', new_value);
        if (new_value < 0) {
            const currentTarget = e.currentTarget;
            shake(currentTarget);
            console.log('Negative value not admited ....');
            e.currentTarget.value = products[current_index].price_for_sale;
            e.stopPropagation();
            return ;
        }
    } else {
        new_value = Number(new_value);
    }
    
    const discount = (products[current_index].price - new_value) * products[current_index].inventory.quantity_for_sale;
    products[current_index].price_for_sale = new_value;
    products[current_index].discount = discount;

    // rayos
    const discount_percent = ((discount / products[current_index].price) / products[current_index].inventory.quantity_for_sale) * 100;

    products[current_index].discount_percent = discount_percent;

    const sale_detail = updateSaleDetail(products);
    state.sale.products = products;
    state.sale.sale_detail = sale_detail;

    try {
        e.currentTarget.remove();
    } catch (err) {
        console.log(err)
    }
};

const pickClient = (state, action) => {
    const {clientId, clients} = action.payload;
    const clientPicked = clients.filter( c => c.id == clientId )[0];
    state.sale.client = clientPicked;
};

const pickNewClient = (state, action) => {
    const clientPicked = action.payload;
    state.sale.client = clientPicked;
};


const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        pickProductAction: pickProduct,
        discountTriggerAction: discountTrigger,
        kickProductAction: kickProduct,
        reduceProductAction: reduceProduct,
        pickClientAction: pickClient,
        pickNewClientAction: pickNewClient,
    },
    extraReducers: (builder) => {
        builder.addCase(loadProducts.pending, (state, action) => {
            state.loading = true
        }).addCase(loadProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload

            // const products_reshape = [];
            // const copy_products = [...state.products];
            // while(copy_products.length) products_reshape.push(copy_products.splice(0, 4));
            // [...state.products_reshape] = products_reshape;
            // console.log(products_reshape);

        }).addCase(loadProducts.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadProducts; ${action.error.message}`
        })
    }
});

export const { 
    pickProductAction, 
    discountTriggerAction, 
    kickProductAction, 
    reduceProductAction, 
    pickClientAction, 
    pickNewClientAction } = productsSlice.actions;
export default productsSlice.reducer;
