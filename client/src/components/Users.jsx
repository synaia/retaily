import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addUser } from "../redux/features/user.feature.js";

import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';


import { pickClientAction, pickNewClientAction } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";

import { F_, validateInputX } from "../util/Utils";


export const Users = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const gridRef = useRef(null);
    const theme = useSelector((state) => state.user.theme);
    const [rows, setRows] = useState([]);
    const payment_redirect = useSelector((state) => state.sale.payment_redirect);
    const printer = useSelector((state) => state.sale.printer);
    const dispatch = useDispatch();

    const {loading, errorMessage, users } =  useSelector((state) => state.user);

    const username = useRef()
    const password = useRef()
    const first_name = useRef()
    const last_name = useRef()
    const [erros, setErrors] = useState();
    const navigator = useNavigate()


    useEffect(()=> {
        setRows(users);
    }, [users]);



    const columns = useMemo( () => {
        return [
            { key: 'selection', name: '',  width: 50, formatter: ({ row }) => {
                return (
                    <div className="selection-client-check" onClick={() => alert('cha paya bobo')}>
                        <span className="material-icons-sharp"> check </span>
                    </div>
                );
            }},
            { key: 'username', name: 'Username', resizable: true, width: 200, editor: textEditor},
            { key: 'first_name', name: 'First Name', width: 150, editor: textEditor },
            { key: 'last_name', name: 'Last Name', width: 150, editor: textEditor },
            { key: 'last_login', name: 'Last-Login', width: 450, editor: textEditor },
          ];
    }); 

    const rowChange = (rows, changes) => {
        const args = {
            'field': changes.column.key,
            'value': rows[changes.indexes[0]][changes.column.key],
            'user_id': rows[changes.indexes[0]].id
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



    const createUser = () => {
        if (!validateInputX(username, "str", setErrors)) {
            return;
        }

        if (!validateInputX(password, "str", setErrors)) {
            return;
        }

        if (!validateInputX(first_name, "str", setErrors)) {
            return;
        }

        const new_user = {
           "username": username.current?.value, 
           "password": password.current?.value, 
           "first_name": first_name.current?.value, 
           "last_name": last_name.current?.value,
           "pic": 'ummmm',
           "scope": [{"name": "inventory.movement.request"}, {"name": "inventory.stores"}],
           "stores": [ {"id": 1}, {"id": 2}]
        }

        console.log(new_user);

        dispatch(addUser(new_user));
        // dispatch(pickNewClientAction(new_user));
        // dispatch(putClientinListAction(new_user));
        // navigator('/', {replace: true});
    }
    

    return (
        <>
            <DataGrid 
                ref={gridRef}
                columns={columns} 
                rows={rows} 
                onRowsChange={rowChange}
                rowKeyGetter={rowKeyGetter} 
                enableVirtualization={true}
                onCellClick={highlightsrow}
                className={`data-grid-user ${theme.grid_theme}`}
            />
            
                <div className="center-left-side-client">
                    {erros &&
                    <h2 className="danger">Please, review the form.</h2>
                    }
                    <div className="user-field">
                        <div>
                            <input className="text" placeholder="Username" ref={username} type="text" />
                        </div>

                        <div>
                            <input className="text" placeholder="Password"  ref={password} type="text"/>
                        </div>
                        
                        <div>
                            <input className="text" placeholder="First Name"  ref={first_name} type="text" />
                        </div>
                        
                        <div>
                            <input className="text" placeholder="Last Name"  ref={last_name} type="text" />
                        </div>
                    </div>

                    <div className="middle-left-side-client" onClick={createUser}>
                        <div>
                            <h3>SAVE NEW</h3>
                        </div>
                    </div>

            </div>
        </>
    )
};