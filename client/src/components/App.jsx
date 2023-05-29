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
import { AdminBoardBulk } from "./AdminBoardBulk";
import { Insights } from "./Insights";
import { Users } from "./Users";
import { Sales } from './Sales';
import { Products } from './Products';
import { SearchBar } from "./SearchBar";
import { Inventory } from './Inventory';
import { PriceList } from "./PriceList";
import { NewProduct } from "./NewProduct";
import { TakePhoto } from "./TakePhoto";
import { BarcodeScanner } from "./BarcodeScanner";
import { Store } from "./Store";
import { StoreMovement } from "./StoreMovement";
import { StoreMovementResponse } from "./StoreMovementResponse";
import { StoreMovementList } from "./StoreMovementList";
import { StoreMovementListResponse } from "./StoreMovementListResponse";
import { StoreList } from "./StoreList";
import { PurchaseList } from "./PurchaseList";
import { Purchase } from "./Purchase";
import { PurchaseOrderListResponse } from "./PurchaseOrderListResponse";
import { PurchaseOrderResponse } from "./PurchaseOrderResponse";
import { OrderBulkResponse } from "./OrderBulkResponse";
import { BulkLabelList } from "./BulkLabelList";
import { Login } from "./Login";
import EventBus from "../common/EventBus"

import package_file from "../../package.json";
import { Theme } from "./Theme";




export const App = () => {
  // useEffect(() => {
  //     document.title = `${package_file.name} ${package_file.version}`;
  // }, []);

  // const logOut = useCallback(() => {
  //   dispatch(logout());
  // }, [dispatch]);

  const logOut = () => {
    console.log('Logout .... ')
  }

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
  });

    return () => {
      EventBus.remove("logout");
    };
  }, []);


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

                  <Route path="/admin" element={<AdminBoard key={1} Content={<Insights/>} Title="Dashboard Main" />} />
                  <Route path="/admin/users/login" element={<Login />} />
                  <Route path="/admin/users" element={<AdminBoard  key={1} Content={<Users/>} Title="Users" />} />
                  <Route path="/admin/sales" element={<AdminBoard  key={3} Content={<Sales/>}  Search={<SearchBar />} Title="Sales" />} />
                  <Route path="/admin/inventory" element={<AdminBoard  key={4} Content={<Inventory/>} Title="Inventory" />} />
                  <Route path="/admin/inventory/products" element={<AdminBoard  key={5} Content={<Products/>} Title="Products" />} />
                  <Route path="/admin/inventory/pricelist" element={<AdminBoard  key={6} Content={<PriceList/>} Title="Price List" />} />
                  <Route path="/admin/inventory/newproduct" element={<AdminBoard  key={7} Content={<NewProduct/>} Title="New Product" />} />
                  <Route path="/admin/inventory/takephoto" element={<TakePhoto  key={8} />} />
                  <Route path="/admin/inventory/barcodescann" element={<BarcodeScanner />} />
                  <Route path="/admin/inventory/store" element={<AdminBoard  key={9} Content={<StoreList/>} Title="Store List" />} />
                  <Route path="/admin/inventory/store/:store_name" element={<AdminBoard  key={10} Content={<Store/>} Title="Store Fix Quantity" />} />
                  <Route path="/admin/inventory/storemov" element={<AdminBoard  key={11} Content={<StoreMovementList/>} Title="Request: Store Movements List" />} />
                  <Route path="/admin/inventory/storemov/:order_id" element={<AdminBoard  key={12} Content={<StoreMovement/>} Title="Request: Store Movements" />} />
                  <Route path="/admin/inventory/storemovresp" element={<AdminBoard  key={13} Content={<StoreMovementListResponse />} Title="Responses: Store Movements List" />} />
                  <Route path="/admin/inventory/storemovresp/:order_id" element={<AdminBoard  key={14} Content={<StoreMovementResponse />} Title="Response: Store Movements" />} />
                  <Route path="/admin/inventory/purchase" element={<AdminBoard  key={15} Content={<PurchaseList />} Title="Request: Purchase List" />} />
                  <Route path="/admin/inventory/purchase/:order_id" element={<AdminBoard  key={16} Content={<Purchase />} Title="Request: Purchase" />} />
                  <Route path="/admin/inventory/purchaseresp" element={<AdminBoard Content={<PurchaseOrderListResponse />} Title="Receive: Purchase Order List" />} />
                  <Route path="/admin/inventory/purchaseresp/:order_id" element={<AdminBoard  key={17} Content={<PurchaseOrderResponse />} Title="Receive: Purchase Order" />} />
                  <Route path="/admin/inventory/bulk/:bulk_id" element={<AdminBoardBulk Content={<OrderBulkResponse />} Title="Bulk Order Process" />} />
                  <Route path="/admin/inventory/bulklist" element={<AdminBoard  key={18} Content={<BulkLabelList />} Title="New Bulk" />} />
                </Routes>
              </Provider>
            </HashRouter>
        </div>
    );
}
