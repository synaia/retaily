import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


export const FindClient = () => {
    const client = useSelector((store) => store.product.sale.client);

    return (
        <Link to="/client">
            <div className="top-left-side-terminal">
                <span className="material-icons-sharp">
                    emoji_people
                </span>
                {client == null  && <h2>find a client ...</h2>}
                {client != null  && <h2>{client.name}</h2>}
            </div>
        </Link>
    )
}