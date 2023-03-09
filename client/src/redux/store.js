import { configureStore } from "@reduxjs/toolkit"
import productReducer from './features/product.feature.js';



const rootReducer = {
   product: productReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;