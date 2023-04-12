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
    products_inv: [],
    changed_count: 0,
    inv_valuation: 0,
    inv_valuation_changed: 0,
    all_products: [],
    pricing_labels: [],
    pricing: [],
    stores: [],
    inventory_head_list: [],
    inventory_head: {},
    resume_inv: {},
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


export const getProductsByInventory = createAsyncThunk('products/getProductsByInventory', async (store_name) => {
    console.log('getProductsByInventory ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/all_inv`, {
        params: {
            store_name: store_name
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });
    return response.data;
});


export const getInventoryHead = createAsyncThunk('products/getInventoryHead', async (store_name) => {
    console.log('getInventoryHead ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/inventory_head`, {
        params: {
            store_name: store_name
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });
    return response.data;
});


export const updateNextQty = createAsyncThunk('product/updateNextQty', async (args, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/update_next_qty`, args,  {
        params: {
            next_quantity: args.next_quantity,
            user_updated: args.user_updated,
            product_id: args.product_id,
            store_id: args.store_id,
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
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


export const getStores = createAsyncThunk('products/get_stores', async () => {
    console.log('get_stores [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/stores`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
        }
    });

    return response.data;
});


export const getStoresInv = createAsyncThunk('products/getStoresInv', async () => {
    console.log('getStoresInv [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/stores_inv`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
        }
    });

    return response.data;
});

export const addStore = createAsyncThunk('product/add_store', async (args, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_store`, args,  {
        params: {
            'store_name': args
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
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

export const addPricing = createAsyncThunk('product/add_pricing', async (args, ) => {
    const { pricing } = args;
    console.log(args);
    let response = await Axios.post(`${BACKEND_HOST}/products/add_pricing`, pricing,  {
        params: {
            percent: args.percent,
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const addProduct = createAsyncThunk('product/add_product', async (product, ) => {
    console.log(product);
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product`, product,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const openInventory = createAsyncThunk('product/openInventory', async (head, ) => {
    console.log(head);
    let response = await Axios.post(`${BACKEND_HOST}/products/open_inventory`, head,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

export const closeInventory = createAsyncThunk('product/closeInventory', async (store, ) => {
    console.log(store);
    let response = await Axios.post(`${BACKEND_HOST}/products/close_inventory`, store,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const cancelInventory = createAsyncThunk('product/cancelInventory', async (store, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/cancel_inventory`, store,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

export const updatePricing = createAsyncThunk('product/update_pricing', async (args, ) => {
    const value = (args.field === 'status') ? (+ args.value) : args.value;
    console.log(args);
    let response = await Axios.post(`${BACKEND_HOST}/products/update_pricing`, args,  {
        params: {
            price_id: args.price_id,
            field: args.field,
            value: value
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
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

const refreshQtyProductList = (state, action) => {
    const {next_quantity, product_id, store_id} = action.payload;
    const products = [...state.products_inv];
    const index = products.findIndex(prod => prod.id == product_id);
    const inventory = [...products[index].inventory]
    inventory[0].next_quantity = next_quantity;
    products[index].inventory = inventory
    state.products_inv = products;
};

const putNewProductInList = (state, action) => {
    const product = action.payload[0]
    const products = [...state.all_products];
    const index = products.findIndex(prod => prod.id == product.id);
    products[index] = product;
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
        refreshProductListAction: refreshProductList,
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

        builder.addCase(getStores.pending, (state, action) => {
            state.loading = true
        }).addCase(getStores.fulfilled, (state, action) => {
            state.loading = false
            state.stores = action.payload
        }).addCase(getStores.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR getStores ; ${action.error.message}`
        });

        builder.addCase(getStoresInv.pending, (state, action) => {
            state.loading = true
        }).addCase(getStoresInv.fulfilled, (state, action) => {
            state.loading = false
            const {inventory_head_list, resume} = action.payload
            state.inventory_head_list = inventory_head_list
            state.resume_inv = resume
        }).addCase(getStoresInv.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR getStoresInv ; ${action.error.message}`
        });

        builder.addCase(addPricing.pending, (state, action) => {
            state.loading = true
        }).addCase(addPricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(addPricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR addPricing() ; ${action.error.message}`
        });

        builder.addCase(updatePricing.pending, (state, action) => {
            state.loading = true
        }).addCase(updatePricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(updatePricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR updatePricing() ; ${action.error.message}`
        });

        builder.addCase(addProduct.pending, (state, action) => {
            state.loading = true
        }).addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false
            putNewProductInList(state, action)
        }).addCase(addProduct.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR addProduct() ; ${action.error.message}`
        });

        builder.addCase(getProductsByInventory.pending, (state, action) => {
            state.loading = true
        }).addCase(getProductsByInventory.fulfilled, (state, action) => {
            state.loading = false
            // 'changed_count': changed_count,
            // 'inv_valuation': inv_valuation,
            // 'inv_valuation_changed': inv_valuation_changed,
            // 'inv_valuation_not_changed': inv_valuation_not_changed
            const { products, changed_count, inv_valuation, inv_valuation_changed } = action.payload
            state.products_inv = products
            state.changed_count = changed_count
            state.inv_valuation_changed = inv_valuation_changed
        }).addCase(getProductsByInventory.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR getProductsByInventory() ; ${action.error.message}`
        });

        builder.addCase(openInventory.pending, (state, action) => {
            state.loading = true
        }).addCase(openInventory.fulfilled, (state, action) => {
            state.loading = false
            // TODO UPDATE IN LIST
        }).addCase(openInventory.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR openInventory() ; ${action.error.message}`
        });

        builder.addCase(getInventoryHead.pending, (state, action) => {
            state.loading = true;
        }).addCase(getInventoryHead.fulfilled, (state, action) => {
            state.loading = false;
            // const changed = state.products_inv.filter(p => p.inventory[0].status === "changed");
            state.inventory_head = action.payload;
            // state.inventory_head.changed = changed.length;
        }).addCase(getInventoryHead.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR getInventoryHead() ; ${action.error.message}`
        });

        builder.addCase(updateNextQty.pending, (state, action) => {
            state.loading = true;
        }).addCase(updateNextQty.fulfilled, (state, action) => {
            state.loading = false;
            refreshQtyProductList(state, action);

            const { stores_inv } = action.payload
            const {inventory_head_list, resume} = stores_inv
            state.inventory_head_list = inventory_head_list
            state.resume_inv = resume

        }).addCase(updateNextQty.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR updateNextQty() ; ${action.error.message}`
        });

        builder.addCase(addStore.pending, (state, action) => {
            state.loading = true;
        }).addCase(addStore.fulfilled, (state, action) => {
            state.loading = false;
            // refresh :)
            const {inventory_head_list, resume} = action.payload
            state.inventory_head_list = inventory_head_list
            state.resume_inv = resume
        }).addCase(addStore.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR addStore() ; ${action.error.message}`
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
