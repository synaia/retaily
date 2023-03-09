/**
 * @file product-list.feature.js
 * @author Wilton Beltre
 * @description  drive in a centralized way all about product methods and remote connection with backend
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

export const pickProduct = (state, action) => {
    const productId = action.payload;
    const productAvailableList = state.products;
    const productPickedList = state.sale.products;
    const productPicked = {...productAvailableList.filter( prod => prod.id == productId )[0]};
    const productExist  = productPickedList.filter( prod => prod.id == productPicked.id )[0];

    if (productPickedList.lenght > 0) {
        productPickedList.forEach(prod => { prod.is_selected = 0; });
    }

    if (productExist != undefined) {
        let index = productPickedList.findIndex(prod => prod.id == productPicked.id);
        productPickedList[index].inventory.quantity_for_sale += 1;
        productPickedList[index].is_selected = 1;
    } else {
        productPicked.is_selected = 1;
        productPickedList.push(productPicked);
    }

     // # clean selection by clicked
    //  let itemcard = Array.from(document.querySelectorAll('.product-productPicked'))
    //  itemcard.forEach(item => item.classList.remove('product-productPicked-selected'))

    const sale_detail = updateSaleDetail(productPickedList);
    state.sale = {'products': productPickedList, 'sale_detail': sale_detail};
    console.log(state.sale);
};


const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        pickProductAction: pickProduct,
    },
    extraReducers: (builder) => {
        builder.addCase(loadProducts.pending, (state, action) => {
            state.loading = true
        }).addCase(loadProducts.fulfilled, (state, action) => {
            state.loading = false
            state.products = action.payload
        }).addCase(loadProducts.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadProducts; ${action.error.message}`
        })
    }
})

export const { pickProductAction } = productsSlice.actions;
export default productsSlice.reducer;
