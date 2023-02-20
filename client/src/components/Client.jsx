import React from "react";
import { useAPI } from '../context/app-context'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";


export const Client = () => {
    const {clients, setClients, isclientloading, sale, setSale, postAddClient, putUpdateClient} = useAPI();
    const [clientIdState, setClientIdState] = useState()
    const documentId = useRef()
    const name = useRef()
    const address = useRef()
    const celphone = useRef()
    const email = useRef()
    const navigator = useNavigate()


    console.log('Clients: rendered.')

    const pickClient = (e)=> {
        const clientId = e.currentTarget.dataset.clientId
        const clientPicked = clients.filter( c => c.id == clientId )[0];
        setSale({...sale, 'client': clientPicked});
        navigator('/', {replace: true})
    }

    const createClient = () => {
        const new_client = {
           "document_id": documentId.current?.value, 
           "name": name.current?.value, 
           "address": address.current?.value, 
           "celphone": celphone.current?.value, 
           "email": email.current?.value,
           "date_create": "2023-02-18T14:58:33",
           "wholesaler": true,
        }
        postAddClient(new_client)
        setSale({...sale, 'client': new_client});
        setClients(clients => [new_client, ...clients])
        navigator('/', {replace: true})
    }

    const getClient = (e) => {
        const clientId = e.currentTarget.dataset.clientId
        setClientIdState(clientId)
        const clientPicked = clients.filter( c => c.id == clientId )[0];
        documentId.current.value = clientPicked?.document_id
        name.current.value = clientPicked?.name
        address.current.value = clientPicked?.address
        celphone.current.value = clientPicked?.celphone
        email.current.value = clientPicked?.email
        // "date_create": "2023-02-18T14:58:33",
        // "wholesaler": true,

    }

    const editClient = () => {
        const current_client = {
            "id": clientIdState,
            "document_id": documentId.current?.value, 
            "name": name.current?.value, 
            "address": address.current?.value, 
            "celphone": celphone.current?.value, 
            "email": email.current?.value,
            "date_create": "2023-02-18T14:58:33",
            "wholesaler": true,
         }
         putUpdateClient(current_client, clientIdState)
         setSale({...sale, 'client': current_client});
         let index = clients.findIndex(c => c.id == current_client.id);
         const new_clients = [...clients] // required really???
         new_clients[index] = current_client
        //  const new_clients = clients.map(c => {
        //     if (c.id == clientIdState) {
        //         return {...c, current_client}
        //     }
        //     return c
        //  })
         setClients(new_clients)
    }
   
    return (
        <div className="container-client">
            <div className="left-side-client">
                <Link to='/'>
                    <div className="top-left-side-client">
                        <span className="material-icons-sharp" >
                        keyboard_return
                    </span>
                        <h2>return </h2>
                    </div>
                </Link>

                <div className="center-left-side-client">
                    <div className="client-field">
                        <div>
                            <h3>Document ID</h3>
                        </div>
                        <div>
                            <input ref={documentId} type="text"  />
                        </div>
                        <div>
                            <h3>Name</h3>
                        </div>
                        <div>
                            <input ref={name} type="text" />
                        </div>
                        <div>
                            <h3>Address</h3>
                        </div>
                        <div>
                            <input ref={address} type="text"  />
                        </div>
                        <div>
                            <h3>Telephone</h3>
                        </div>
                        <div>
                             <input ref={celphone} type="text" />
                        </div>
                        <div>
                             <h3>E-mail</h3>
                        </div>
                        <div>
                            <input ref={email} type="text"  />
                        </div>
                    </div>
                </div>
                {clientIdState == null &&
                    <div className="middle-left-side-client" onClick={createClient}>
                        <div>
                            <h3>SAVE</h3>
                        </div>
                    </div>
                }
                {clientIdState != null &&
                    <div className="middle-left-side-client" onClick={editClient}>
                        <div>
                            <h3>UPDATE</h3>
                        </div>
                    </div>
                }
            </div>


            <main>
                <div className="header-content">
                    <div>
                        <h1>Dashboard:Client</h1>
                    </div>
                    <div>
                        <div className="right">
                            <div className="top">
                                <button id="menu-btn">
                                    <span className="material-icons-sharp"> menu </span>
                                </button>
                                <div className="theme-toggler-variant">
                                    <span className="material-icons-sharp "> wifi </span>
                                    <span className="material-icons-sharp"> print </span>
                                </div>
                                <div className="theme-toggler">
                                    <span className="material-icons-sharp "> light_mode </span>
                                    <span className="material-icons-sharp active"> dark_mode </span>
                                </div>
                                <div className="profile">
                                    <div className="info">
                                        <p>Hey, <b>Bruno</b></p>
                                        <small className="text-muted">Admin</small>
                                    </div>
                                    <div className="profile-photo">
                                        <img src="./assets/images/profile-1.jpg" alt="Profile Picture" />
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </div>
                    </div>

                    <div className="search-client">
                    <input type="text" />
                    </div>
                    

                <div className="client-grid ">
                    <div className="recent-orders">
                        <table id="recent-orders--table">
                         <thead>
                            <tr>
                                <th> </th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                            </tr>
                         </thead>
                         <tbody>
                                {isclientloading && <div>Clientes yujuuu lalala ;D  .... </div>}
                                {!isclientloading && (
                                    clients.map((client, i) => (
                                        <tr key={i} >
                                            <td onClick={getClient} data-client-id={client.id}>
                                                <span className="material-icons-sharp">
                                                    west
                                                </span>
                                            </td>
                                            <td onClick={pickClient} data-client-id={client.id}>
                                                {client.name}
                                            </td>
                                            <td onClick={pickClient} data-client-id={client.id}>
                                                {client.celphone}
                                            </td>
                                        </tr>
                                    ))
                                )}
                         </tbody>
                        </table>
                        <a href="#">Show All</a>
                    </div>
                </div>
      </main>





        </div>

        
    );
}