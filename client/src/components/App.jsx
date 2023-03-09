import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Provider} from "react-redux";
import store from "../redux/store";
import { Terminal } from "./Terminal";
import { ProductGrid } from "./ProductGrid";
import { Client } from "./Client";
import { Payment } from "./Payment";


export const App = () => {
    return (
        <div >
            <Router>
              <Provider store={store}>
              {/* Some header here */}
                <Routes>
                  <Route path="/" element={<Terminal />} />
                  <Route path="/client" element={<Client />}/>
                  <Route path="/payment" element={<Payment />}/>
                  <Route path="/prods" element={<ProductGrid />}/>
                </Routes>
              </Provider>
            </Router>
        </div>
    );
}
