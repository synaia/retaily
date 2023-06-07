import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addUser, scopes, addScope, deleteScope, addStores, deleteStores } from "../redux/features/user.feature.js";

import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';


import { pickClientAction, pickNewClientAction } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";

import { F_, validateInputX } from "../util/Utils";


export const Users = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const scopes = useSelector((state) => state.user.scopes);
    const gridRef = useRef(null);
    const theme = useSelector((state) => state.user.theme);
    const [rows, setRows] = useState([]);
    const payment_redirect = useSelector((state) => state.sale.payment_redirect);
    const printer = useSelector((state) => state.sale.printer);
    const dispatch = useDispatch();

    const {loading, errorMessage, users } =  useSelector((state) => state.user);
    const stores = useSelector((state) => state.product.stores);

    const username = useRef()
    const password = useRef()
    const first_name = useRef()
    const last_name = useRef()
    const [erros, setErrors] = useState();

    const navigator = useNavigate()

    const [userscopes, setUserScope] = useState([]);
    const [userstores, setUserStores] = useState([]);
    const [user, setUser] = useState();
    

    useEffect(()=> {
        setRows(users);
    }, []);

    const viewUserDetail = (username) => {
        const user = {...users.find(u => u.username == username)};
        setUser(user);
    }

    useEffect(() => {
        if (user != null) {
            const u = [];
            scopes.forEach(s => {
                const check = (user.scope.find(us => us.name == s.name)  != null) ? true : false;
                if (check) {
                    u.push(s.name);
                }
            });
            setUserScope(u);

            const f = [];
            stores.forEach(r => {
                const check = (user.stores.find(st => st.name == r.name) != null) ? true : false;
                if (check) {
                    f.push(r.name);
                }
            });
            setUserStores(f);

        }
    }, [user]);

    const checkScope = (name) => {
        console.log(name);

        const edit_user = {
            "id": user.id, 
            "scope": [{"name": name}]
        }

        if (userscopes.includes(name)) {
            setUserScope(userscopes.filter(n => n !== name));
            dispatch(deleteScope(edit_user));
        } else {
            setUserScope([...userscopes, name]);
            dispatch(addScope(edit_user));
        }
    }

    const checkStore = (name) => {
        console.log(name);

        const edit_user = {
            "id": user.id, 
            "stores": [{"name": name}]
        }


        if (userstores.includes(name)) {
            setUserStores(userstores.filter(n => n !== name));
            dispatch(deleteStores(edit_user));
        } else {
            setUserStores([...userstores, name])
            dispatch(addStores(edit_user));
        }
    }

    const isInUserScope = (name) => {
        return userscopes.includes(name);
    }

    const isInUserStore = (name) => {
        return userstores.includes(name);
    }

    useEffect(() => {
        console.log('userscopes', userscopes)
    }, [userscopes]);

    useEffect(() => {
        console.log('userstores', userstores)
    }, [userstores]);

   

    const columns = useMemo( () => {
        return [
            { key: 'scopes', name: '',  width: 50, formatter: ({ row }) => {
                return (
                    <div className="selection-client-check" onClick={() => viewUserDetail(row.username)}>
                        <span className="material-icons-sharp user-btn"> radio_button_unchecked </span>
                    </div>
                );
            }},
            { key: 'username', name: 'Username', resizable: true, width: 200, editor: textEditor},
            { key: 'first_name', name: 'First Name', width: 150, editor: textEditor },
            { key: 'last_name', name: 'Last Name', width: 150, editor: textEditor },
            { key: 'last_login', name: 'Last-Login', width: 180, editor: textEditor },
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

        let _userscopes = userscopes.map(row => {
            return {"name": row};
        });

        let _userstores = userstores.map(row => {
            return {"name": row};
        });


        const new_user = {
           "username": username.current?.value, 
           "password": password.current?.value, 
           "first_name": first_name.current?.value, 
           "last_name": last_name.current?.value,
           "pic": 'ummmm',
           "scope": _userscopes,
           "stores": _userstores
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

                    <div className="user-scope-div">
                        {user && 
                            <h2>{user.first_name} Scopes</h2>
                        }
                        <div>
                        {user && scopes.map((s, i) => (
                            <div key={i}>
                                <input type="checkbox" name="choice"  id={i} 
                                    checked={isInUserScope(s.name)}
                                    onClick={() => checkScope(s.name)} 
                                />
                                <label className="l-scope"  htmlFor={i}>{s.name}</label>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="user-scope-div">
                        {user && 
                            <h2>{user.first_name} Stores</h2>
                        }
                        <div>
                        {user && stores.map((s, i) => (
                            <div key={i}>
                                <input type="checkbox" name="choice"  id={s.name} 
                                    checked={isInUserStore(s.name)}
                                    onClick={() => checkStore(s.name)} 
                                />
                                <label className="l-scope"  htmlFor={s.name}>{s.name}</label>
                            </div>
                        ))}
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