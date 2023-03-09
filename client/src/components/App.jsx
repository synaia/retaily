import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ProductGrid } from "./ProductGrid";
import {Provider} from "react-redux";
import store from "../redux/store";


export const App = () => {
    return (
        <div >
            <Router>
              <Provider store={store}>
              {/* Some header here */}
                <Routes>
                    <Route path="/" element={<ProductGrid />}/>
                </Routes>
              </Provider>
            </Router>
        </div>
    );
}
