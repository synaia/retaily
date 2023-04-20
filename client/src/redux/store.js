import { configureStore } from "@reduxjs/toolkit"
import productReducer from './features/product.feature.js';
import clientReducer from './features/client.feature.js';
import saleReducer from './features/sale.feature.js';
import userReducer from './features/user.feature.js';
import providerReducer from './features/provider.feature.js';



const rootReducer = {
   product: productReducer,
   client: clientReducer,
   sale: saleReducer,
   user: userReducer,
   provider: providerReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;