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
import { NewProduct } from "./NewProduct";
import { TakePhoto } from "./TakePhoto";
import { Store } from "./Store";
import { StoreMovement } from "./StoreMovement";
import { StoreMovementResponse } from "./StoreMovementResponse";
import { StoreMovementList } from "./StoreMovementList";
import { StoreMovementListResponse } from "./StoreMovementListResponse";



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
                  <Route path="/admin/inventory/newproduct" element={<AdminBoard Content={<NewProduct/>} Title="New Product" />} />
                  <Route path="/admin/inventory/takephoto" element={<TakePhoto />} />
                  <Route path="/admin/inventory/store/:store_name" element={<AdminBoard Content={<Store/>} Title="Store Fix Quantity" />} />
                  <Route path="/admin/inventory/storemov/:order_id" element={<AdminBoard Content={<StoreMovement/>} Title="Store Movements" />} />
                  <Route path="/admin/inventory/storemovresp/:order_id" element={<AdminBoard Content={<StoreMovementResponse />} Title="Response: Store Movements" />} />
                  <Route path="/admin/inventory/storemovlist/" element={<AdminBoard Content={<StoreMovementList/>} Title="Store Movements List" />} />
                  <Route path="/admin/inventory/storemovlistresp/" element={<AdminBoard Content={<StoreMovementListResponse />} Title="Responses: Store Movements List" />} />
                </Routes>
              </Provider>
            </HashRouter>
        </div>
    );
}
