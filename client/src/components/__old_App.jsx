import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Terminal} from "./Terminal"
import {Client} from "./Client";
import { Payment } from "./Payment";
import { AppContextProvider } from "../context/app-context";
import { ProductGridRedux } from "./ProductGridRedux";


export const App = () => {
    return (
        <div >
            <AppContextProvider>
            <Router>
            {/* Some header here */}
                <Routes>
                    <Route path="/" element={<Terminal />} />
                    <Route path="/client" element={<Client />}/>
                    <Route path="/payment" element={<Payment />}/>
                    <Route path="/prods" element={<ProductGridRedux />}/>
                </Routes>
            </Router>
           </AppContextProvider>
        </div>
    );
}
