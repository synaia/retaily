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
    all_products: [],
    pricing_labels: [],
    pricing: [],
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

export const loadAllProducts = createAsyncThunk('products/load_all_products', async () => {
    console.log('load_all_products...');
    let response = await Axios.get(`${BACKEND_HOST}/products/all`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});

export const getPricingLabels = createAsyncThunk('products/get_pricing_labels', async () => {
    console.log('get_pricing_labels...');
    let response = await Axios.get(`${BACKEND_HOST}/products/pricing_labels`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});

export const getPricing = createAsyncThunk('products/get_pricing', async () => {
    console.log('get_pricing [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/pricing`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});

export const updateProduct = createAsyncThunk('product/update_product', async (args, ) => {
    const value = (args.field === 'active') ? (+ args.value) : args.value;
    let response = await Axios.post(`${BACKEND_HOST}/products/update`, args,  {
        params: {
            pricing_id: args.pricing_id,
            product_id: args.product_id,
            field: args.field,
            value: value
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
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

const discardSale = (state, action) => {
    // reset sale to initial state
    if(!confirm('Really?')) return;
    
    state.sale = {
        'client': null, 
        'products': [], 
        'sale_detail': {
            'gran_total': 0, 
            'sub_total': 0, 
            'sub_tax': 0
        }
    };
};

const refreshProductList = (state, action) => {
    const { field, value, product_id, pricing_id} = action.payload;
    const products = [...state.all_products];
    const index = products.findIndex(prod => prod.id == product_id);
    if(pricing_id != -1) {
        const pricinglist = [...products[index].pricinglist];
        pricinglist[field] = value;
        pricinglist.forEach((ls) => {
            if(field === ls.pricing.price_key) {
                // console.log('MATCH:', ls.pricing.price_key)
                ls.price = value;
            }
        });
        products[index].pricinglist = pricinglist;
    } else {
        products[index][field] = value;
    }
    state.all_products = products;
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
        discardSaleAction: discardSale,
        refreshProductListAction: refreshProductList
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
        });

        builder.addCase(loadAllProducts.pending, (state, action) => {
            state.loading = true
        }).addCase(loadAllProducts.fulfilled, (state, action) => {
            state.loading = false
            state.all_products = action.payload
        }).addCase(loadAllProducts.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadAllProducts; ${action.error.message}`
        });

        builder.addCase(getPricingLabels.pending, (state, action) => {
            state.loading = true
        }).addCase(getPricingLabels.fulfilled, (state, action) => {
            state.loading = false
            state.pricing_labels = action.payload
        }).addCase(getPricingLabels.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR getPricingLabels; ${action.error.message}`
        });

        builder.addCase(getPricing.pending, (state, action) => {
            state.loading = true
        }).addCase(getPricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(getPricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR pricing_labels ; ${action.error.message}`
        });
    }
});


export const { 
    pickProductAction, 
    discountTriggerAction, 
    kickProductAction, 
    reduceProductAction, 
    pickClientAction, 
    pickNewClientAction,
    discardSaleAction,
    refreshProductListAction
} = productsSlice.actions;

export default productsSlice.reducer;
