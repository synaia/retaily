import { configureStore } from "@reduxjs/toolkit"
import productReducer from './features/product.feature.js';
import clientReducer from './features/client.feature.js';
import saleReducer from './features/sale.feature.js';



const rootReducer = {
   product: productReducer,
   client: clientReducer,
   sale: saleReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;