/**
 * @file product-list.feature.js
 * @author Wilton Beltre
 * @description  drive in a centralized way all about product methods and remote connection with backend.
 * @version 1.0.0
 * @license MIT 
 */
import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_HOST } from "../../util/constants";
import { storeInfo } from "../../common/store-info";
import { beauty } from "../../util/Utils.js";
import { getLastLoggedUser } from "../../api/db";

import { lang } from "../../common/spa.lang.js";

let current = await getLastLoggedUser('url:product.feature.js');

const initialState = {
    loading: false,
    loading_all_products: false,
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
    bulk_labels: [],
    sale: {
        'client': null, 
        'products': [], 
        'sale_detail': {
            'discount_total': 0,
            'gran_total': 0, 
            'sub_total': 0, 
            'sub_tax': 0,
            'delivery': 0,
        },
        'user': current
    },
    delivers: [],
    sales_totals: {},
    errorMessage: {
        errors: [],
        notify: false,
    },
};


export const loadProducts = createAsyncThunk('products/loadProducts', async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    // console.log('from loadProducts/ ', state.product);
    // if (state.product.products.length > 0) {
    //     console.log('> state.products allready loaded.');    
    //     return;
    // } 
    console.log('> loadProducts...');
    let response = await Axios.get(`${BACKEND_HOST}/products/`, {});
    return response.data;
});

export const loadAllProducts = createAsyncThunk('products/load_all_products', async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log('load_all_products...');
    let response = await Axios.get(`${BACKEND_HOST}/products/all`, {});
    return response.data;
});


export const getProductsByInventory = createAsyncThunk('products/getProductsByInventory', async (store_name) => {
    console.log('getProductsByInventory ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/all_inv`, {
        params: {
            store_name: store_name
        }
    });
    return response.data;
});


export const getProductsAllInventory = createAsyncThunk('products/all_inv_new_version', async (store_id) => {
    console.log('getProductsAllInventory: [products, count_resume] store_id', store_id);
    let response = await Axios.get(`${BACKEND_HOST}/products/all_inv_new_version/${store_id}`, {});
    return response.data;
});


export const getInventoryHead = createAsyncThunk('products/getInventoryHead', async (store_name) => {
    console.log('getInventoryHead ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/inventory_head`, {
        params: {
            store_name: store_name
        }
    });
    return response.data;
});


export const getInventoryHeadByStoreId = createAsyncThunk('products/inventory_head_store_id', async (store_id) => {
    console.log('inventory_head_store_id ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/inventory_head_store_id/${store_id}`, {
        params: {
            'store_id': store_id
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
        }
    });
    return response.data;
});


export const getPricingLabels = createAsyncThunk('products/get_pricing_labels', async () => {
    console.log('get_pricing_labels...');
    let response = await Axios.get(`${BACKEND_HOST}/products/pricing_labels`, {});

    return response.data;
});

export const getPricing = createAsyncThunk('products/get_pricing', async () => {
    console.log('get_pricing [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/pricing`, {});

    return response.data;
});


export const getStores = createAsyncThunk('products/get_stores', async () => {
    console.log('get_stores [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/stores`, {});

    return response.data;
});


export const getStoresInv = createAsyncThunk('products/getStoresInv', async () => {
    console.log('getStoresInv [table] ...');
    let response = await Axios.get(`${BACKEND_HOST}/products/stores_inv`, {});

    return response.data;
});

export const addStore = createAsyncThunk('product/add_store', async (args, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_store`, args,  {
        params: {
            'store_name': args
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
        }
    });
});

export const addPricing = createAsyncThunk('product/add_pricing', async (args, ) => {
    const { pricing } = args;
    console.log(args);
    let response = await Axios.post(`${BACKEND_HOST}/products/add_pricing`, pricing,  {
        params: {
            percent: args.percent,
        }
    });
    return response.data;
});


export const addProduct = createAsyncThunk('product/add_product', async (product, ) => {
    console.log(product);
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product`, product,  {});
    return response.data;
});


export const openInventory = createAsyncThunk('product/openInventory', async (head, ) => {
    console.log(head);
    let response = await Axios.post(`${BACKEND_HOST}/products/open_inventory`, head,  {});
    return response.data;
});

export const closeInventory = createAsyncThunk('product/closeInventory', async (store, ) => {
    console.log(store);
    let response = await Axios.post(`${BACKEND_HOST}/products/close_inventory`, store,  {});
    return response.data;
});


export const cancelInventory = createAsyncThunk('product/cancelInventory', async (store, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/cancel_inventory`, store,  {});
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
        }
    });
    return response.data;
});


export const addProductOrder = createAsyncThunk('product/add_product_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product_order`, order,  {});
    return response.data;
});

export const processOrder = createAsyncThunk('product/process_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/process_order`, order,  {});
    return response.data;
});


export const rollbackOrder = createAsyncThunk('product/rollback_order', async (order, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/rollback_order`, order,  {});
    return response.data;
});


export const addProductOrderLine = createAsyncThunk('product/add_product_order_line', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_product_order_line`, line,  {});
    return response.data;
});


export const issueProductOrderLine = createAsyncThunk('product/issue_order_line', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/issue_order_line`, line,  {});
    return response.data;
});

export const approbalIssueOrderLine = createAsyncThunk('product/approbal_issue', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/approbal_issue`, line,  {});
    return response.data;
});

export const getMovProductOrders = createAsyncThunk('product/product_order', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/product_order`,   {
        params: {
            'order_type': 'movement'
        }
    });
    return response.data;
});

export const getPurchaseProductOrders = createAsyncThunk('product/purchase_product_order', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/product_order`,   {
        params: {
            'order_type': 'purchase'
        }
    });
    return response.data;
});


export const assignOrderToBulk = createAsyncThunk('product/assign_order_to_bulk', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/assign_order_to_bulk`, line,  {});
    return response.data;
});

export const getBulkOrder = createAsyncThunk('product/read_bulk_order', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/read_bulk_order`,   {});
    return response.data;
});

export const addBulkOrder = createAsyncThunk('product/add_bulk_order', async (line, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/products/add_bulk_order`, line,  {});
    return response.data;
});

export const getDelivery = createAsyncThunk('product/delivery', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/delivery`,   {});
    return response.data;
});

export const salesTotal = createAsyncThunk('product/sales_total', async () => {
    let response = await Axios.get(`${BACKEND_HOST}/products/sales_total`,   {});
    return response.data;
});


const updateSaleDetail = (productPickedList, delivery_value) => {
    let gran_total = productPickedList.reduce((x, p) => {
        return (x + (p.price_for_sale * p.inventory[0].quantity_for_sale));
    }, 0);

    const sub_total = gran_total / (1 + storeInfo.tax);
    const sub_tax = sub_total * storeInfo.tax;

    const discount_total = productPickedList.reduce((x, p) => {
        return (p.discount) ? x + p.discount : x;
    }, 0)

    const delivery = delivery_value;

    gran_total = gran_total + delivery;

    const sale_detail = {'discount_total': discount_total, 'gran_total': gran_total, 'sub_total': sub_total, 'sub_tax': sub_tax, 'delivery': delivery};
    return sale_detail;
};

const updateDeliveryValue = (state, action) => {
    const value = action.payload;
    console.log(beauty(state.sale.sale_detail))

    const productPickedList = [...state.sale.products];
    const sale_detail = updateSaleDetail(productPickedList, value);
    state.sale.sale_detail = sale_detail;
}

const pickProduct = (state, action) => {
    const productId = action.payload;
    const productAvailableList = state.products;
    const productPickedList = [...state.sale.products];
    const productPicked = {...productAvailableList.filter( prod => prod.id == productId )[0]};
    const productExist  = productPickedList.filter( prod => prod.id == productPicked.id )[0];

    productPickedList.forEach(prod => { prod.is_selected = 0; });

    if (productExist != undefined) {
        let index = productPickedList.findIndex(prod => prod.id == productPicked.id);
        productPickedList[index].inventory[0].quantity_for_sale += 1;
        productPickedList[index].is_selected = 1;
    } else {
        productPicked.is_selected = 1;
        productPickedList.push(productPicked);
    }

    const sale_detail = updateSaleDetail(productPickedList, state.sale.sale_detail.delivery);
    state.sale.products = productPickedList;
    state.sale.sale_detail = sale_detail;
};

const kickProduct = (state, action) => {
    const productId = action.payload;
    const products = [...state.sale.products];
    const index = products.findIndex(prod => prod.id == productId);
    products.splice(index, 1);
    const sale_detail = updateSaleDetail(products, state.sale.sale_detail.delivery);
    state.sale.products = products;
    state.sale.sale_detail = sale_detail;
};

const reduceProduct = (state, action) => {
    const productId = action.payload;
    const products = [...state.sale.products];
    const index = products.findIndex(prod => prod.id == productId);
    if (products[index].inventory[0].quantity_for_sale == 1) {
        kickProduct(state, action);
        return;
    } else {
        products[index].inventory[0].quantity_for_sale -= 1;
        products[index].is_selected = 1;
        const sale_detail = updateSaleDetail(products, state.sale.sale_detail.delivery);
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
    
    const discount = (products[current_index].price - new_value) * products[current_index].inventory[0].quantity_for_sale;
    products[current_index].price_for_sale = new_value;
    products[current_index].discount = discount;

    // rayos
    const discount_percent = ((discount / products[current_index].price) / products[current_index].inventory[0].quantity_for_sale) * 100;

    products[current_index].discount_percent = discount_percent;

    const sale_detail = updateSaleDetail(products, state.sale.sale_detail.delivery);
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

const cleanSale = (state) => {
    state.sale = {
        'client': null, 
        'products': [], 
        'sale_detail': {
            'discount_total': 0,
            'gran_total': 0, 
            'sub_total': 0, 
            'sub_tax': 0,
            'delivery': 0,
        },
        'user': current
    };
}

const discardSale = (state, action) => {
    // reset sale to initial state
    if(!confirm(lang.pos.discardsale)) return;
    
   cleanSale(state);
};

const finishSale = (state, action) => {
    cleanSale(state);
};

const refreshProductList = (state, action) => {
    const { field, value, product_id, pricing_id} = action.payload;
    const products = [...state.all_products];
    const products_pos = [...state.products];
    const index = products.findIndex(prod => prod.id == product_id);
    const indexpos = products_pos.findIndex(prod => prod.id == product_id);
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
        products_pos[indexpos].price = parseFloat(value);
    } else {
        products[index][field] = value;
        products_pos[indexpos][field] = value
    }
    state.all_products = products;
    state.products = products_pos;
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
    const products_pos = [...state.products];
    product.price_for_sale = product.price;
    product.inventory[0].quantity_for_sale = 1;
    products.push(product)
    products_pos.push(product)
    state.all_products = products;
    state.products = products_pos;
};

const refreshOnProductOrderList = (state, action) => {
    const { _order, remaining }= action.payload; 
    console.log('remaining', remaining)
    console.log('_order', _order)

    let cOrders;
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

        const all_products = [...state.all_products];
        const products = [...state.products];

        const p = all_products.find(prod => prod.id == remaining.product_id);

        updateQtyProductInstance(
            [p], 
            all_products, 
            remaining.store_id, 
            state.all_products, 
            remaining.remaining_quantity
            );

        updateQtyProductInstance(
            [p], 
            products, 
            remaining.store_id, 
            state.all_products, 
            remaining.remaining_quantity
            );
        
    }
};


const refreshOnProductOrder = (state, action) => {
    const { order, line } = action.payload; 
    console.log('line => ', line);
    console.log('_order => ', order);
    console.log('--------------------------')
    console.log('purchase => ', JSON.parse(JSON.stringify([...state.purchase_orders])))
    let cOrders = [...state.orders];
    if (order.order_type === "movement") {
        cOrders = [...state.orders];
    } else {
        cOrders = [...state.purchase_orders];
    }
    const oIndex = cOrders.findIndex(o => o.id == order.id);
    cOrders[oIndex] = order;
    if (order.order_type === "movement") {
        state.orders = cOrders;
    } else {
        state.purchase_orders = cOrders;
    }

    const all_products = [...state.all_products];
    const products = [...state.products];

    order.product_order_line.forEach(_line => {
        const id = _line.product_id;
        const qty = _line.quantity_observed;
        const store_id = _line.to_store.id;

        const p = all_products.find(prod => prod.id == id);

        const inv  = p.inventory.find(inv => inv.store.id == store_id);
        const new_quantity = inv.quantity + qty

        updateQtyProductInstance(
            [p], 
            all_products, 
            store_id, 
            state.all_products, 
            new_quantity
            );

        
        updateQtyProductInstance(
            [p], 
            products, 
            store_id, 
            state.all_products, 
            new_quantity
            );

    })
};

const refreshBulkyList = (state, action) => {
    const { order, line } = action.payload; 

    const __bulk_orders = [...state.bulk_orders];
    const m1 = beauty(__bulk_orders);
    const idxorder = __bulk_orders.findIndex(bulk => {
        if (bulk === undefined) return

        return bulk.bulk_order_id  == order.bulk_order_id
    });
    //TODO: bug bug here .lines <<< not defined on udpdate qty Movement Response.
   if (idxorder != -1) {
    const __orderlines = [...__bulk_orders[idxorder].lines];
    const m2 = beauty(__orderlines);
    const idxline = __orderlines.findIndex(ln => ln.product.id == line.product_id);
    __orderlines[idxline].quantity_observed = line.quantity_observed;

    const status = order.product_order_line.find(p => p.product.id == line.product_id).status;
    __orderlines[idxline].status = status;


    __bulk_orders[idxorder].lines = __orderlines;
    const m3 = beauty(__orderlines);
    const m4 = beauty(__bulk_orders);
    state.bulk_orders = __bulk_orders;
   }

    // const purchases = [...state.purchase_orders];
    // const index  = purchases.findIndex(pur => pur.id == order.id);
    // const lines = [...purchases[index].product_order_line];
    // const pindex = lines.findIndex(ln => ln.product.id == line.product_id);
    // lines[pindex].quantity_observed = line.quantity_observed; // the product...

    // console.log('the product => ', lines[pindex]);

    // purchases[index].product_order_line = lines;
    // state.purchase_orders = purchases;

    // fromPurchaseToBulk(state.purchase_orders, state);
}


const fromPurchaseToBulk = (__purchase_orders, state) => {
    let __bulk_orders = [...state.bulk_orders];

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
                'bulk_order_id': __order.bulk_order_id,
                'bulk_order_name': __order.bulk_order_name,
                'bulk_order_memo': __order.bulk_order_memo,
                'orders': __bulk_orders[__order.bulk_order_id].orders.concat(flatOrder(__order)),
                'lines': __bulk_orders[__order.bulk_order_id].lines.concat(__order.product_order_line)
            }
        }  else {
            __bulk_orders[__order.bulk_order_id] = {
                'bulk_order_id': __order.bulk_order_id,
                'bulk_order_name': __order.bulk_order_name,
                'bulk_order_memo': __order.bulk_order_memo,
                'orders': [flatOrder(__order)],
                'lines': __order.product_order_line
            };
        }
    })

    __bulk_orders = __bulk_orders.filter( elem => elem != null );

    const temp = beauty(__bulk_orders);
    state.bulk_orders = __bulk_orders;
}

const updateProductInstance = (productlist, productsInstance, selectedStore, stateReference) => {
    productlist.forEach( p => {
        const index = productsInstance.findIndex(prod => prod.id == p.id);
        const invIndex = productsInstance[index].inventory.findIndex(inv => inv.store.name == selectedStore);

        const availableQty = productsInstance[index].inventory[invIndex].quantity;
        const soldQty = p.inventory[0].quantity_for_sale; // alway 0:index
        const residualQty = availableQty - soldQty;
        productsInstance[index].inventory[invIndex].quantity = residualQty;
        stateReference = productsInstance;
    });
}

const updateQtyProductInstance = (productIDlist, productsInstance, store_id, stateReference, remaining_quantity) => {
    productIDlist.forEach( p => {
        const index = productsInstance.findIndex(prod => prod.id == p.id);
        const invIndex = productsInstance[index].inventory.findIndex(inv => inv.store.id == store_id);
        if (invIndex == -1) {
            // Update current product.inventory for current logged user.
            productsInstance[index].inventory[0].quantity = remaining_quantity;
        } else {
            // Update other inventory for all.
            productsInstance[index].inventory[invIndex].quantity = remaining_quantity;
        }
        stateReference = productsInstance;
    });
}

const lowOffProductQty = (state, action) => {
    const {productlist, selectedStore } = action.payload;
    const products = [...state.products];
    const all_products = [...state.all_products];
    updateProductInstance(productlist, products, selectedStore, state.products);
    updateProductInstance(productlist, all_products, selectedStore, state.all_products);
}

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
        finishSaleAction: finishSale,
        refreshProductListAction: refreshProductList,
        lowOffProductQtyAction: lowOffProductQty,
        updateDeliveryValueAction: updateDeliveryValue,
        cleanBulkOrders: (state, action) => {
            state.bulk_orders = [];
        },
        setErrViewedProduct: (state, action) => {
            state.errorMessage.notify = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadProducts.pending, (state, action) => {
            state.loading_all_products = true;
            state.loading = true
        }).addCase(loadProducts.fulfilled, (state, action) => {            
            state.products = action.payload
            console.log('VARIABLE ASIGNADA')
            state.loading = false;
            state.loading_all_products  = false;
        }).addCase(loadProducts.rejected, (state, action) => {
            state.loading = false;
            state.loading_all_products  = false;
            state.errorMessage.errors.push(`ERROR loadProducts; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(loadAllProducts.pending, (state, action) => {
            state.loading = true
        }).addCase(loadAllProducts.fulfilled, (state, action) => {
            state.loading = false
            state.all_products = action.payload
        }).addCase(loadAllProducts.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR loadAllProducts; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getPricingLabels.pending, (state, action) => {
            state.loading = true
        }).addCase(getPricingLabels.fulfilled, (state, action) => {
            state.loading = false
            state.pricing_labels = action.payload
        }).addCase(getPricingLabels.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR getPricingLabels; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getPricing.pending, (state, action) => {
            state.loading = true
        }).addCase(getPricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(getPricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR pricing_labels ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getStores.pending, (state, action) => {
            state.loading = true
        }).addCase(getStores.fulfilled, (state, action) => {
            state.loading = false
            state.stores = action.payload
        }).addCase(getStores.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR getStores ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getStoresInv.pending, (state, action) => {
            state.loading = true
        }).addCase(getStoresInv.fulfilled, (state, action) => {
            state.loading = false
            const {inventory_head_list, resume} = action.payload
            state.inventory_head_list = inventory_head_list
            state.resume_inv = resume
            console.log('DELAY DELAY')
        }).addCase(getStoresInv.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR getStoresInv ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addPricing.pending, (state, action) => {
            state.loading = true
        }).addCase(addPricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(addPricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR addPricing() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(updatePricing.pending, (state, action) => {
            state.loading = true
        }).addCase(updatePricing.fulfilled, (state, action) => {
            state.loading = false
            state.pricing = action.payload
        }).addCase(updatePricing.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR updatePricing() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addProduct.pending, (state, action) => {
            state.loading = true
        }).addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false
            putNewProductInList(state, action)
            // loadAllProducts();
        }).addCase(addProduct.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR addProduct() ; ${action.error.message}`);
            state.errorMessage.notify = false;
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
            state.errorMessage.errors.push(`ERROR getProductsByInventory() ; ${action.error.message}`);
            state.errorMessage.notify = false;
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
            state.errorMessage.errors.push(`ERROR getProductsAllInventory() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(openInventory.pending, (state, action) => {
            state.loading = true
        }).addCase(openInventory.fulfilled, (state, action) => {
            state.loading = false
            // TODO UPDATE IN LIST
        }).addCase(openInventory.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR openInventory() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getInventoryHead.pending, (state, action) => {
            state.loading = true;
        }).addCase(getInventoryHead.fulfilled, (state, action) => {
            state.loading = false;
            // const changed = state.products_inv.filter(p => p.inventory[0].status === "changed");
            state.inventory_head = action.payload;
            console.log('inventory_head DELAY');
            // state.inventory_head.changed = changed.length;
        }).addCase(getInventoryHead.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getInventoryHead() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getInventoryHeadByStoreId.pending, (state, action) => {
            state.loading = true;
        }).addCase(getInventoryHeadByStoreId.fulfilled, (state, action) => {
            state.loading = false;
            state.inventory_head_by_store = action.payload;
        }).addCase(getInventoryHeadByStoreId.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getInventoryHeadByStoreId() ; ${action.error.message}`);
            state.errorMessage.notify = false;
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
            state.errorMessage.errors.push(`ERROR updateNextQty() ; ${action.error.message}`);
            state.errorMessage.notify = false;
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
            state.errorMessage.errors.push(`ERROR addStore() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getMovProductOrders.pending, (state, action) => {
            state.loading = true;
        }).addCase(getMovProductOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload
        }).addCase(getMovProductOrders.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getProductOrders() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getPurchaseProductOrders.pending, (state, action) => {
            state.loading = true;
        }).addCase(getPurchaseProductOrders.fulfilled, (state, action) => {
            state.loading = false;
            const __purchase_orders = action.payload;
            state.purchase_orders = __purchase_orders;

            fromPurchaseToBulk(__purchase_orders, state);

        }).addCase(getPurchaseProductOrders.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getPurchaseProductOrders() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addProductOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(addProductOrder.fulfilled, (state, action) => {
            state.loading = false;
            const { order_type } = action.meta.arg;
            if (order_type == 'purchase') {
                state.purchase_orders = action.payload;
            } else {
                state.orders = action.payload;
            }
        }).addCase(addProductOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR addProductOrder() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(processOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(processOrder.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
        }).addCase(processOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR processOrder() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(rollbackOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(rollbackOrder.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
        }).addCase(rollbackOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR rollbackOrder() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addProductOrderLine.pending, (state, action) => {
            state.loading = true;
        }).addCase(addProductOrderLine.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrderList(state, action);
        }).addCase(addProductOrderLine.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR addProductOrderLine() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(issueProductOrderLine.pending, (state, action) => {
            state.loading = true;
        }).addCase(issueProductOrderLine.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
            refreshBulkyList(state, action);
        }).addCase(issueProductOrderLine.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR issueProductOrderLine() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(approbalIssueOrderLine.pending, (state, action) => {
            state.loading = true;
        }).addCase(approbalIssueOrderLine.fulfilled, (state, action) => {
            state.loading = false;
            refreshOnProductOrder(state, action);
            refreshBulkyList(state, action);
        }).addCase(approbalIssueOrderLine.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR approbalIssueOrderLine() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getBulkOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(getBulkOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.bulk_labels = action.payload;
        }).addCase(getBulkOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getBulkOrder() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addBulkOrder.pending, (state, action) => {
            state.loading = true;
        }).addCase(addBulkOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.bulk_labels = action.payload;
        }).addCase(addBulkOrder.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getBulkOrder() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(getDelivery.pending, (state, action) => {
            state.loading = true;
        }).addCase(getDelivery.fulfilled, (state, action) => {
            state.loading = false;
            state.delivers = action.payload;
        }).addCase(getDelivery.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR getDelivery() ; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(salesTotal.pending, (state, action) => {
            state.loading = true;
        }).addCase(salesTotal.fulfilled, (state, action) => {
            state.loading = false;
            state.sales_totals = action.payload;
        }).addCase(salesTotal.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage.errors.push(`ERROR salesTotal() ; ${action.error.message}`);
            state.errorMessage.notify = false;
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
    finishSaleAction,
    refreshProductListAction,
    cleanBulkOrders,
    lowOffProductQtyAction,
    updateDeliveryValueAction,
    setErrViewedProduct
} = productsSlice.actions;

export default productsSlice.reducer;
