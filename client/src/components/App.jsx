import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { StoreList } from "./StoreList";
import { PurchaseList } from "./PurchaseList";
import { Purchase } from "./Purchase";

import package_file from "../../package.json";
import { Theme } from "./Theme";




export const App = () => {
  // useEffect(() => {
  //     document.title = `${package_file.name} ${package_file.version}`;
  // }, []);



    return (
        <div >
            <HashRouter>
              <Provider store={store}>
                <Theme />
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
                  <Route path="/admin/inventory/store" element={<AdminBoard Content={<StoreList/>} Title="Store List" />} />
                  <Route path="/admin/inventory/store/:store_name" element={<AdminBoard Content={<Store/>} Title="Store Fix Quantity" />} />
                  <Route path="/admin/inventory/storemov" element={<AdminBoard Content={<StoreMovementList/>} Title="Request: Store Movements List" />} />
                  <Route path="/admin/inventory/storemov/:order_id" element={<AdminBoard Content={<StoreMovement/>} Title="Request: Store Movements" />} />
                  <Route path="/admin/inventory/storemovresp" element={<AdminBoard Content={<StoreMovementListResponse />} Title="Responses: Store Movements List" />} />
                  <Route path="/admin/inventory/storemovresp/:order_id" element={<AdminBoard Content={<StoreMovementResponse />} Title="Response: Store Movements" />} />
                  <Route path="/admin/inventory/purchase" element={<AdminBoard Content={<PurchaseList />} Title="Request: Purchase List" />} />
                  <Route path="/admin/inventory/purchase/:order_id" element={<AdminBoard Content={<Purchase />} Title="Request: Purchase" />} />
                </Routes>
              </Provider>
            </HashRouter>
        </div>
    );
}
