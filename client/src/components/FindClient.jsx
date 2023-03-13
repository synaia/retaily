import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



export const FindClient = () => {
    const client = useSelector((store) => store.product.sale.client);

    return (
            <div className="top-left-side-terminal">
                <span className="material-icons-sharp">
                    face
                </span>
                <Link to="/client">
                {client == null  && <h2>find a client ...</h2>}
                {client != null  && <h2>{client.name}</h2>}
                </Link>
            </div>
    )
}