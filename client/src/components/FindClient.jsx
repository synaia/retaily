import React from "react";
import { Link } from "react-router-dom";

export const FindClient = () => {

    return (
        <Link to="/client">
            <div className="top-left-side">
                <span className="material-icons-sharp">
                    emoji_people
                </span>
                <h2>find a client ...</h2>
            </div>
        </Link>
    )
}