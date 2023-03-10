import { configureStore } from "@reduxjs/toolkit"
import productReducer from './features/product.feature.js';
import clientReducer from './features/client.feature.js';



const rootReducer = {
   product: productReducer,
   client: clientReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;