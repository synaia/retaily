/**
 * @file Client.jsx
 * @author Wilton Beltre
 * @description  Clients management and pick.
 * @license MIT
 */


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addClient, updateClient, putClientinListAction, updateClientinListAction } from "../redux/features/client.feature.js";

import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';


import { pickClientAction, pickNewClientAction } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";

import { F_, validateInputX } from "../util/Utils";


export const Client = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const gridRef = useRef(null);
    const theme = useSelector((state) => state.user.theme);
    const [rows, setRows] = useState([]);
    const payment_redirect = useSelector((state) => state.sale.payment_redirect);
    const printer = useSelector((state) => state.sale.printer);
    const dispatch = useDispatch();

    const clientState = useSelector((state) => state.client);
    const {loading, errorMessage, clients } = clientState;
    const [clientIdState, setClientIdState] = useState();
    const search = useRef();

    const documentId = useRef()
    const name = useRef()
    const address = useRef()
    const celphone = useRef()
    const email = useRef()
    const [erros, setErrors] = useState();
    const navigator = useNavigate()

    const params = useParams();

    document.querySelector('.search-bar').focus();

    useEffect(()=> {
        setRows(clients);
    }, [clients]);



    const columns = useMemo( () => {
        return [
            { key: 'selection', name: '',  width: 50, formatter: ({ row }) => {
                return (
                    <div className="selection-client-check" onClick={() => pickClient(row.id)}>
                        <span className="material-icons-sharp"> check </span>
                    </div>
                );
            }},
            { key: 'name', name: 'Name', resizable: true, width: 200, editor: textEditor},
            { key: 'document_id', name: 'Document', width: 150, editor: textEditor },
            { key: 'celphone', name: 'Phone', width: 150, editor: textEditor },
            { key: 'address', name: 'Address', width: 450, editor: textEditor },
          ];
    }); 

    const rowChange = (rows, changes) => {
        const args = {
            'field': changes.column.key,
            'value': rows[changes.indexes[0]][changes.column.key],
            'client_id': rows[changes.indexes[0]].id
        };

        console.log(args);
       
        // dispatch(updatePricing(args))
    };

     /**
     @todo: return 0 its NOT a option.
    **/
     const rowKeyGetter = (row) => {
        // console.log('aqqui: ', row);
        if (row != undefined) {
            return row.id;
        } else {
            console.log('WARNING rowKeyGetter row undefined')
            return 0;
        }
    };

    const highlightsted = [];
    const highlightsrow = (v, n) => {
        if (highlightsted.length == 1) {
            highlightsted[0].classList.toggle('row-selected-bg');
            highlightsted.pop();
        }

        const e = n.target.parentElement;
        highlightsted.push(e);
        e.classList.toggle('row-selected-bg');
        
    };

    useEffect(() => {
        const root = document.querySelector("#root");
        root.classList.add('page-anim');
        return () => {
            root.classList.remove('page-anim');
        }
    }, []);

    const pickClient = (clientId)=> {
        dispatch(pickClientAction({clientId, clients}));
        if (payment_redirect) {
            navigator('/payment', {replace: false});
        } else {
            navigator('/', {replace: false});
        }
    }

    const createClient = () => {
        if (!validateInputX(name, "str", setErrors)) {
            return;
        }

        if (!validateInputX(celphone, "str", setErrors)) {
            return;
        }

        const new_client = {
           "document_id": documentId.current?.value, 
           "name": name.current?.value, 
           "address": address.current?.value, 
           "celphone": celphone.current?.value, 
           "email": email.current?.value,
           "wholesaler": false,
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
        // if (ev.keyCode === 13) {
        if (keyin.length > 3 || ev.keyCode === 13) {
            console.log(keyin);
            let list_filtered = clients.filter((cli) => {
                if (cli && (JSON.stringify(cli.name) !== 'null' || JSON.stringify(cli.celphone) !== 'null')) {
                    return cli.name.toUpperCase().includes(keyin.toUpperCase()) ||
                        cli.celphone.toUpperCase().includes(keyin.toUpperCase())
                } else {
                    return false
                }
            });

            setRows(list_filtered, ...clients);
        } else {
            return false;
        }
    };

   
    return (
        <div className="container-client">
            
            <main>
                <div className="header-content">
                    <div>
                        <h1>POS:Client</h1>
                        <a className="text-muted-m" href='/#'> 
                            <span>return</span> 
                        </a>
                    </div>
                    <div>
                        <div className="right">
                            <div className="top">
                                <button id="menu-btn">
                                    <span className="material-icons-sharp"> menu </span>
                                </button>
                                <div className="theme-toggler-variant">
                                    <span className="material-icons-sharp "> wifi </span>
                                    {printer.isrunning == true &&
                                        <span className="material-icons-sharp"> print </span>
                                    }
                                    {printer.isrunning == false &&
                                        <span className="material-icons-sharp danger"> print_disabled </span>
                                    }
                                </div>
                                <div className="theme-toggler">
                                    <span className="">  </span>
                                    <span className="">  </span>
                                </div>
                                <div className="profile">
                                    <div className="info">
                                    {currentUser && currentUser.selectedStore &&
                                        <a href="/#/admin">
                                        <p><b>{currentUser.first_name}</b>@{currentUser.selectedStore}</p>
                                        </a>
                                    }
                                    </div>
                                    <div className="profile-photo">
                                    {currentUser &&
                                        <img src={currentUser.pic} alt="Profile Picture" />
                                    }
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </div>
                    </div>

                    <div className="search-client">
                        <input ref={search} type="text" onKeyUp={filterClient} className="search-bar" />
                    </div>

                    <DataGrid 
                        ref={gridRef}
                        columns={columns} 
                        rows={rows} 
                        onRowsChange={rowChange}
                        rowKeyGetter={rowKeyGetter} 
                        enableVirtualization={true}
                        onCellClick={highlightsrow}
                        className={`data-grid-client ${theme.grid_theme}`}
                    />
                    


                        <div className="center-left-side-client">
                            {erros &&
                            <h2 className="danger">Please, review the client name and celphone.</h2>
                            }
                            <div className="client-field">
                                <div>
                                    <input className="text" placeholder="Document ID" ref={documentId} type="text" />
                                </div>

                                <div>
                                    <input className="text" placeholder="Names"  ref={name} type="text"/>
                                </div>
                                
                                <div className="address-client-d">
                                    <textarea className="address-client" placeholder="address" ref={address} type="text"  />
                                </div>
                               
                                <div>
                                    <input className="text" placeholder="Movil"  ref={celphone} type="text" />
                                </div>
                               
                                <div>
                                    <input className="text" placeholder="eMail"  ref={email} type="text" />
                                </div>
                            </div>

                        {clientIdState == null &&
                            <div className="middle-left-side-client" onClick={createClient}>
                                <div>
                                    <h3>SAVE NEW</h3>
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
      </main>





        </div>

        
    );
}