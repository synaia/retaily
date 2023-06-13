import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { lang } from "../common/spa.lang.js";



export const FindClient = () => {
    const client = useSelector((store) => store.product.sale.client);

    return (
            <div className="top-left-side-terminal">
                <span className="material-icons-sharp">
                    face
                </span>
                <Link to="/client">
                {client == null  && <h2>{lang.pos.find_client}</h2>}
                {client != null  && <h2>{client.name}</h2>}
                </Link>
            </div>
    )
}