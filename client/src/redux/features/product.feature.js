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
    products_all_inv: [],
    count_resume: {},
    changed_count: 0,
    inv_valuation: 0,
    inv_valuation_changed: 0,
    all_products: [],
    pricing_labels: [],
    pricing: [],
    stores: [],
    inventory_head_list: [],
    inventory_head: {},
    inventory_head_by_store: {},
    resume_inv: {},
    orders: [],
    purchase_orders: [],
    bulk_orders: [],
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


export const getProductsAllInventory = createAsyncThunk('products/all_inv_new_version', async () => {
    console.log('getProductsAllInventory: [products, count_resume]');
    let response = await Axios.get(`${BACKEND_HOST}/products/all_inv_new_version`, {
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


export const getInventoryHeadByStoreId = createAsyncThunk('products/inventory_head_store_id', async (store_id) => {
    console.log('inventory_head_store_id ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/inventory_head_store_id/${store_id}`, {
        params: {
            'store_id': store_id
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


export const addProductOrder = createAsyncThunk('product/add_product_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product_order`, order,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

export const processOrder = createAsyncThunk('product/process_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/process_order`, order,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const rollbackOrder = createAsyncThunk('product/rollback_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/rollback_order`, order,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const addProductOrderLine = createAsyncThunk('product/add_product_order_line', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product_order_line`, line,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});


export const issueProductOrderLine = createAsyncThunk('product/issue_order_line', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/issue_order_line`, line,  {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

export const getMovProductOrders = createAsyncThunk('product/product_order', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/product_order`,   {
        params: {
            'order_type': 'movement'
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

export const getPurchaseProductOrders = createAsyncThunk('product/purchase_product_order', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/product_order`,   {
        params: {
            'order_type': 'purchase'
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

const refreshOnProductOrderList = (state, action) => {
    const { _order, remaining }= action.payload; 
    let cOrders = [...state.orders];
    if (_order.order_type === "movement") {
        cOrders = [...state.orders];
    } else {
        cOrders = [...state.purchase_orders];
    }
    const oIndex = cOrders.findIndex(o => o.id == _order.id);
    cOrders[oIndex] = _order;
    if (_order.order_type === "movement") {
        state.orders = cOrders;
    } else {
        state.purchase_orders = cOrders;
    }

    if (_order.order_type === "movement") {
        const cProducts = [...state.products_all_inv];
        const pIndex = cProducts.findIndex(p => p.id == remaining.product_id);
        const cInventoryList = [...cProducts[pIndex].inventory];
        const cIndex = cInventoryList.findIndex(i => i.store.id == remaining.store_id)

        cInventoryList[cIndex].quantity = remaining.remaining_quantity;

        cProducts[pIndex].inventory = cInventoryList;
        state.products_all_inv = cProducts;
    }
};


const refreshOnProductOrder = (state, action) => {
    const _order = action.payload; 
    let cOrders = [...state.orders];
    if (_order.order_type === "movement") {
        cOrders = [...state.orders];
    } else {
        cOrders = [...state.purchase_orders];
    }
    const oIndex = cOrders.findIndex(o => o.id == _order.id);
    cOrders[oIndex] = _order;
    if (_order.order_type === "movement") {
        state.orders = cOrders;
    } else {
        state.purchase_orders = cOrders;
    }
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

        builder.addCase(getProductsAllInventory.pending, (state, action) => {
            state.loading = true
        }).addCase(getProductsAllInventory.fulfilled, (state, action) => {
            state.loading = false
            const { products, count_resume} = action.payload
            state.products_all_inv = products
            state.count_resume = count_resume
        }).addCase(getProductsAllInventory.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR getProductsAllInventory() ; ${action.error.message}`
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

        builder.addCase(getInventoryHeadByStoreId.pending, (state, action) => {
            state.loading = true;
        }).addCase(getInventoryHeadByStoreId.fulfilled, (state, action) => {
            state.loading = false;
            state.inventory_head_by_store = action.payload;
        }).addCase(getInventoryHeadByStoreId.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR getInventoryHeadByStoreId() ; ${action.error.message}`
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

        builder.addCase(getMovProductOrders.pending, (state, action) => {
            state.loading = true;
        }).addCase(getMovProductOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload
        }).addCase(getMovProductOrders.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR getProductOrders() ; ${action.error.message}`
        });

        builder.addCase(getPurchaseProductOrders.pending, (state, action) => {
            state.loading = true;
        }).addCase(getPurchaseProductOrders.fulfilled, (state, action) => {
            state.loading = false;
            const __purchase_orders = action.payload;
            state.purchase_orders = __purchase_orders;

            const __bulk_orders = [...state.bulk_orders];

            const flatOrder = (__order) => {
                const o = {...__order};
                delete o.product_order_line;
                delete o.bulk_order_id;
                delete o.bulk_order_name;
                return o;
            }
           
            __purchase_orders.forEach(__order => {
                if (__order.bulk_order_id == 0) {
                    return;
                } else if (__bulk_orders[__order.bulk_order_id] != undefined) {
                    __bulk_orders[__order.bulk_order_id] = {
                        'bulk_order_name': __order.bulk_order_name,
                        'bulk_order_memo': __order.bulk_order_memo,
                        'orders': __bulk_orders[__order.bulk_order_id].orders.concat(flatOrder(__order)),
                        'lines': __bulk_orders[__order.bulk_order_id].lines.concat(__order.product_order_line)
                    }
                }  else {
                    __bulk_orders[__order.bulk_order_id] = {
                        'bulk_order_name': __order.bulk_order_name,
                        'bulk_order_memo': __order.bulk_order_memo,
                        'orders': [flatOrder(__order)],
                        'lines': __order.product_order_line
                    };
                }
            })

            state.bulk_orders = __bulk_orders;

        }).addCase(getPurchaseProductOrders.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR getPurchaseProductOrders() ; ${action.error.message}`
        });

        builder.addCase(addProductOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(addProductOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload
        }).addCase(addProductOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR addProductOrder() ; ${action.error.message}`
        });

        builder.addCase(processOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(processOrder.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
        }).addCase(processOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR processOrder() ; ${action.error.message}`
        });

        builder.addCase(rollbackOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(rollbackOrder.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
        }).addCase(rollbackOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR rollbackOrder() ; ${action.error.message}`
        });

        builder.addCase(addProductOrderLine.pending, (state, action) => {
            state.loading = true;
        }).addCase(addProductOrderLine.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrderList(state, action);
        }).addCase(addProductOrderLine.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR addProductOrderLine() ; ${action.error.message}`
        });

        builder.addCase(issueProductOrderLine.pending, (state, action) => {
            state.loading = true;
        }).addCase(issueProductOrderLine.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
        }).addCase(issueProductOrderLine.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = `ERROR issueProductOrderLine() ; ${action.error.message}`
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
