import React from "react";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { ProductPickedReadOnly } from "./ProductPickedReadOnly";
import { F_ } from "../util/Utils";
import { useSelector } from "react-redux";



export const Payment = () => {
    const sale = useSelector((store) => store.product.sale);
    const sale_detail = sale.sale_detail;

    console.log('Payment: rendered.')
    return (

        <div className="container-pay">
            <div className="left-side-client">
                <Link to='/'>
                    <div className="top-left-side-pay">
                        <span className="material-icons-sharp" >
                        keyboard_return
                    </span>
                        <h2>return </h2>
                    </div>
                </Link>
                
                <ProductPickedReadOnly />

                <div className="bottom-left-side">
                    
                </div>

            </div>

            <main>
                <Header />
                
                <div className="product-grid ">
                    <div className="invoice-to">
                        {sale.client == null  && <h1>YOU SUPPOSED TO PICK A CLIENT BEFORE ...</h1>}
                        {sale.client != null  && <h1>Invoiced to: {sale.client.name}</h1>}
                    </div>
                    <div>
                         {sale.client != null  && <h2>Address: {sale.client?.address}</h2>}
                    </div>
                    <div>
                         {sale.client != null  && <h2>Phone: {sale.client?.celphone}</h2>}
                    </div>
                    <div className="middle-left-side-pay">
                        <div>
                            <h3>DELIVERY</h3>
                        </div>
                        <div>
                            <h3>SUB: {F_(sale_detail.sub_total)}</h3>
                        </div>
                        <div>
                            <h3>ITBIS: {F_(sale_detail.sub_tax)}</h3>
                        </div>
                        <div>
                            <h2>TOTAL: {F_(sale_detail.gran_total)}</h2>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}