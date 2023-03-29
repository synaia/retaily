import React from "react";
import {BrowserRouter as Router, Routes, Route, HashRouter} from 'react-router-dom'
import {Provider} from "react-redux";
import store from "../redux/store";
import { Terminal } from "./Terminal";
import { ProductGrid } from "./ProductGrid";
import { Client } from "./Client";
import { Payment } from "./Payment";
import {Init } from "./Init";

import { AdminBoard } from "./AdminBoard";
import { Insights } from "./Insights";
import { Users } from "./Users";
import { Sales } from './Sales';
import { Products } from './Products';
import { SearchBar } from "./SearchBar";
import { Inventory } from './Inventory';
import { PriceList } from "./PriceList";

export const App = () => {
    return (
        <div >
            <HashRouter>
              <Provider store={store}>
                <Init />
              {/* Some header here */}
                <Routes>
                  <Route path="/" element={<Terminal />} />
                  <Route path="/client" element={<Client />}/>
                  <Route path="/payment" element={<Payment />}/>
                  <Route path="/prods" element={<ProductGrid />}/>

                  <Route path="/admin" element={<AdminBoard Content={<Insights/>} Title="Dashboard Main" />} />
                  <Route path="/admin/users" element={<AdminBoard Content={<Users/>} Title="Users" />} />
                  <Route path="/admin/sales" element={<AdminBoard Content={<Sales/>}  Search={<SearchBar />} Title="Sales" />} />
                  <Route path="/admin/inventory" element={<AdminBoard Content={<Inventory/>} Title="Inventory" />} />
                  <Route path="/admin/inventory/products" element={<AdminBoard Content={<Products/>} Title="Products" />} />
                  <Route path="/admin/inventory/pricelist" element={<AdminBoard Content={<PriceList/>} Title="Price List" />} />
                </Routes>
              </Provider>
            </HashRouter>
        </div>
    );
}
