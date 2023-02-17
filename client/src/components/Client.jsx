import React from "react";
import { useAPI } from '../context/app-context'


import { useEffect } from "react";


export const Client = () => {
    const {clients, isclientloading} = useAPI();
    console.log('Clients: rendered.')
   
    return (
        <div className="tile is-child notification is-success">
        {isclientloading && <div>Clientes yujuuu lalala ;D  .... </div>}
        {!isclientloading && (
            clients.map((client, i) => (
                <div key={i}>{client.name}</div>
            ))
        )}
        </div>
);
}