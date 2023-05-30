import React from "react";
import { useEffect } from "react";


import '../../assets/animista.css'

export const Loading = ({Text, Intro}) => {
    const clazz = Intro != undefined ? "text-focus-in" : "pulsate-fwd" 
    const visible = Intro != undefined ? "visible" : "" 
    const anim = Intro != undefined ? "anim-grad " : "" 

    useEffect(() => {
        if(Intro != undefined ) {
        const root = document.querySelector('#root')
        root.classList.add('root-opaque');
        return () => {
            root.classList.remove('root-opaque');
        }
        }
    }, []);

    return (
        <div className={clazz}>
            <h2 className={`mytext ${anim} ${visible}`}>{Text}</h2>
        </div>
    )
}