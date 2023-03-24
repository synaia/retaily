import React from "react";

import '../../assets/animista.css'

export const Loading = ({Text, Intro}) => {
    const clazz = Intro != undefined ? "text-blur-out" : "pulsate-fwd" 

    return (
        <div className={clazz}>
            <h2>{Text}</h2>
        </div>
    )
}