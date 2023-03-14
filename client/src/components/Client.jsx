/**
 * @file Client.jsx
 * @author Wilton Beltre
 * @description  Clients management and pick.
 * @license MIT
 */


import React, { useState, createContext, forwardRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addClient, updateClient, putClientinListAction, updateClientinListAction } from "../redux/features/client.feature.js";
import { pickClientAction, pickNewClientAction } from "../redux/features/product.feature.js";


export const Client = () => {
    const dispatch = useDispatch();

    const clientState = useSelector((state) => state.client);
    const {loading, errorMessage, clients } = clientState;
    const [clients_partial, set_clients_partial] = useState([]);
    const [clientIdState, setClientIdState] = useState();
    const search = useRef();

    const documentId = useRef()
    const name = useRef()
    const address = useRef()
    const celphone = useRef()
    const email = useRef()
    const navigator = useNavigate()

    useEffect(() => {
        set_clients_partial(clients.slice(0, 20));
        const gridObject = document.querySelector('.client-grid');
        let c = 1;
        const WINDOW = 200;
        gridObject.addEventListener('scroll', (event) => {
            const y = gridObject.scrollTop;
            // console.log(y);
            if (y > (200 * c)) {
                console.log(`y : ${y}`);
                c += 1;
                set_clients_partial(...clients_partial, clients.slice(0, 10*c));
            }
        });
    }, [clients]);

    const pickClient = (clientId)=> {
        dispatch(pickClientAction({clientId, clients}));
        navigator('/', {replace: true});
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
        dispatch(addClient(new_client));
        dispatch(pickNewClientAction(new_client));
        dispatch(putClientinListAction(new_client));
        navigator('/', {replace: true});
    }

    const getClient = (clientId) => {
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
         dispatch(updateClient(current_client));
         dispatch(pickNewClientAction(current_client));
         dispatch(updateClientinListAction(current_client));
         navigator('/', {replace: true});
    }
    
    const filterClient = (ev) => {
        let keyin = search.current?.value;
        if (ev.keyCode === 13) {
            console.log(keyin);
            let list_filtered = clients.filter((cli) => {
                if (cli && (JSON.stringify(cli.name) !== 'null' || JSON.stringify(cli.celphone) !== 'null')) {
                    return cli.name.toUpperCase().includes(keyin.toUpperCase()) ||
                        cli.celphone.toUpperCase().includes(keyin.toUpperCase())
                } else {
                    return false
                }
            });

            set_clients_partial(list_filtered, ...clients_partial);
        } else {
            return false;
        }
    };

   
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
                            <input ref={documentId} type="text" />
                        </div>
                        <div>
                            <h3>Name</h3>
                        </div>
                        <div>
                            <input ref={name} type="text"/>
                        </div>
                        <div>
                            <h3>Address</h3>
                        </div>
                        <div>
                            <textarea ref={address} type="text"  />
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
                            <input ref={email} type="text" />
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
                        <input ref={search} type="text" onKeyDown={filterClient}/>
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
                                {loading && <tr><td>Clientes yujuuu lalala ;D  .... </td></tr>}
                                {!loading && errorMessage &&  <tr><td> {errorMessage} </td></tr>}
                                {!loading && (
                                    clients_partial.map((client, i) => (
                                        <tr key={i} >
                                            <td onClick={() => getClient(client.id)} data-client-id={client.id}>
                                                <span className="material-icons-sharp">
                                                    west
                                                </span>
                                            </td>
                                            <td onClick={() => pickClient(client.id)} data-client-id={client.id}>
                                                {client.name}
                                            </td>
                                            <td onClick={() => pickClient(client.id)} data-client-id={client.id}>
                                                {client.celphone}
                                            </td>
                                        </tr>
                                    ))
                                )}
                         </tbody>
                        </table>
                    </div>
                </div>
      </main>





        </div>

        
    );
}