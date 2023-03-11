/**
 * @file Client.jsx
 * @author Wilton Beltre
 * @description  Clients management and pick.
 * @license MIT
 */


import React, { useState, createContext, forwardRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addClient, updateClient, putClientinListAction, updateClientinListAction } from "../redux/features/client.feature.js";
import { pickClientAction, pickNewClientAction } from "../redux/features/product.feature.js";
import { FixedSizeGrid as Grid } from "react-window";


export const Client = () => {
    const dispatch = useDispatch();

    const clientState = useSelector((state) => state.client);
    const {loading, errorMessage, clients } = clientState;
    const [clientIdState, setClientIdState] = useState();

    const documentId = useRef()
    const name = useRef()
    const address = useRef()
    const celphone = useRef()
    const email = useRef()
    const navigator = useNavigate()


    const StickyGridContext = createContext();
    StickyGridContext.displayName = "StickyListContext";

    const ItemWrapper = ({ data, rowIndex, columnIndex, style }) => {
        const { ItemRenderer, stickyIndices } = data;
        if (stickyIndices && stickyIndices.includes(rowIndex) && stickyIndices.includes(columnIndex)) {
          return null;
        }
        return <ItemRenderer rowIndex={rowIndex} columnIndex={columnIndex} style={style} />;
    };

    console.log('Clients: rendered.')
    const columns  = ['id', 'name', 'celphone'];
    const Cell = ({ columnIndex, rowIndex, style }) => (
        <div style={style} onClick={() => pickClient(columnIndex, clients[rowIndex].id)} className="celldiv">
           {(columnIndex == 0) ? <span className="material-icons-sharp">west</span> : clients[rowIndex][columns[columnIndex]]}
        </div>
    );

    const innerElementType = forwardRef(({ children, ...rest }, ref) => (
        <StickyGridContext.Consumer>
          {({ stickyIndices }) => (
            <div ref={ref} {...rest}>
              { 
                stickyIndices.map(rowIndex => (
                        columns.map(columnIndex => (
                        <Cell
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            key={rowIndex}
                            style={{ top: rowIndex * 35, left: 0, width: "100%", height: 35 }}
                        />
                    ))
                ))
              }
              {children}
            </div>
          )}
        </StickyGridContext.Consumer>
      ));
      
      const StickyGrid = ({ children, stickyIndices, ...rest }) => (
        <StickyGridContext.Provider value={{ ItemRenderer: children, stickyIndices }}>
          {/* <List itemData={{ ItemRenderer: children, stickyIndices }} {...rest}>
            {ItemWrapper}
          </List> */}
          <Grid 
            itemData={{ ItemRenderer: children, stickyIndices }} {...rest}
            >
            {ItemWrapper}
        </Grid>
        </StickyGridContext.Provider>
      );

    

    const pickClient = (columnIndex, clientId)=> {
        if (columnIndex != 0) {
            dispatch(pickClientAction({clientId, clients}));
            navigator('/', {replace: true})
        } else {
            getClient(clientId);
        }
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
                            <input ref={documentId} type="text" autocomplete="off"  />
                        </div>
                        <div>
                            <h3>Name</h3>
                        </div>
                        <div>
                            <input ref={name} type="text" autocomplete="off" />
                        </div>
                        <div>
                            <h3>Address</h3>
                        </div>
                        <div>
                            <textarea ref={address} type="text"  autocomplete="off"  />
                        </div>
                        <div>
                            <h3>Telephone</h3>
                        </div>
                        <div>
                             <input ref={celphone} type="text" autocomplete="off" />
                        </div>
                        <div>
                             <h3>E-mail</h3>
                        </div>
                        <div>
                            <input ref={email} type="text" autocomplete="off"  />
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

                    <Grid
                        columnCount={columns.length}
                        rowCount={clients.length}
                        columnWidth={280}
                        width={640}
                        height={530}
                        rowHeight={45}
                    >
                        {Cell}
                    </Grid>

                    {/* <StickyGrid
                        innerElementType={innerElementType}
                        stickyIndices={[0, 1]}
                        columnCount={columns.length}
                        columnWidth={200}
                        height={350}
                        rowCount={clients.length}
                        rowHeight={35}
                        width={800}
                    >
                        {Cell}
                    </StickyGrid> */}


                        {/* <table id="recent-orders--table">
                         <thead>
                            <tr>
                                <th> </th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                            </tr>
                         </thead>
                         <tbody>
                                {loading && <div>Clientes yujuuu lalala ;D  .... </div>}
                                {!loading && errorMessage &&  <div>ERROR: {errorMessage} </div>}
                                {!loading && (
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
                        </table> */}
                    </div>
                </div>
      </main>





        </div>

        
    );
}