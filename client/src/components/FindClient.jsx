import React from "react";
import { Link } from "react-router-dom";
import { useAPI } from '../context/app-context'

export const FindClient = () => {
    const {sale} = useAPI();

    return (
        <Link to="/client">
            <div className="top-left-side-terminal">
                <span className="material-icons-sharp">
                    emoji_people
                </span>
                {sale.client == null  && <h2>find a client ...</h2>}
                {sale.client != null  && <h2>{sale.client.name}</h2>}
            </div>
        </Link>
    )
}