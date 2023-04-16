import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';

import { addProductOrderLine } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";
import { F_, validateInputX } from "../util/Utils.js";



import 'react-data-grid/lib/styles.css';


export const StoreMovement = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigator = useNavigate()
    const products_all_inv = useSelector((state) => state.product.products_all_inv);
    const orders = useSelector((state) => state.product.orders);
    const [order, setOrder] = useState();
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const loading = useSelector((state) => state.product.loading);

    const [cellNavigationMode, setCellNavigationMode] = useState('NONE');
    const [rows, setRows] = useState([]);
    const [rows_order, setRowsOrder] = useState([]);

    const search = useRef();
    const gridRef = useRef(null);

    const search_order = useRef();
    const gridRef_order = useRef(null);

    const [productFoundLeft, SetProductFoundLeft] = useState(0);
    const [productFoundRight, SetProductFoundRight] = useState(0);


    const get_rows_from_products = (__products, __order) => {
        const __rows = [];
        const store_id = __order.from_store.id;
        const lines = __order.product_order_line;
        __products.forEach(product => {
            let index = 0;
            let quantity_to_move = 0;
            try {
                index = product.inventory.findIndex(inv => inv.store.id == store_id);
                const line = lines.filter( ln => ln.product.id == product.id)[0]
                if (line != undefined) {
                    quantity_to_move = line.quantity_observed;
                }
            } catch (error) {
                index = 0;
                quantity_to_move = 0;
                console.log('order not defined yet ... ', error);
            }
            const row = {
                'id': product.id,
                'name': product.name,
                'cost': product.cost,
                'code': product.code,
                'quantity': product.inventory[index].quantity,
                'quantity_to_move': quantity_to_move, 
                'status': product.inventory[index].status
            };
            __rows.push(row);
        });
        return __rows;
    };

    const get_rows_from_order = (__lines, spread = false) => {
        const __rows = [];
        if (spread) {
            __lines.forEach(l => {
                const row = {
                    'id': l.id,
                    'name': l.name,
                    'code': l.code,
                    'quantity_observed': l.quantity_observed
                };
                __rows.push(row)
            });
        } else {
            __lines.forEach(l => {
                const row = {
                    'id': l.product.id,
                    'name': l.product.name,
                    'code': l.product.code,
                    'quantity_observed': l.quantity_observed
                };
                __rows.push(row)
            });
        }
        return __rows;
    };

    useEffect(() => {
        if (orders.length > 0) {
            const __order = orders.filter( o => { return o.id == params.order_id})[0];
            setOrder(__order);
            setRowsOrder(get_rows_from_order(__order.product_order_line));
    
            let keyin = search.current?.value;
            if (keyin != '') {
                let list_filtered = products_all_inv.filter((prod) => {
                    if (prod) {
                        let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                        let has = prod.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                        return  has ||
                            prod.code.toUpperCase().includes(keyin.toUpperCase());
                    } else {
                        return false;
                    }
                });
                setRows(get_rows_from_products(list_filtered, __order));
                SetProductFoundLeft(`${list_filtered.length} products found`);
            } else {
                setRows(get_rows_from_products(products_all_inv, __order));
                SetProductFoundLeft(`${products_all_inv.length} products in total`);
            }

        }
    }, [orders, products_all_inv]);


    const columns = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Product', resizable: true, width: 300},
            { key: 'code', name: 'SKU', width: 100 },
            { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                return <div className="row-bg-no-changed">{row.quantity}</div>;
            }},
            { key: 'quantity_to_move', name: 'Move Quantity', editor: textEditor, width: 100, formatter: ({ row }) => {
                return <div className="row-bg-no-changed">{row.quantity_to_move}</div>;
            }}
          ];
    }); 


    const columns_order = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Product', resizable: true, width: 300},
            { key: 'code', name: 'SKU', width: 100 },
            { key: 'quantity', name: 'Quantity',  editor: textEditor, width: 100, formatter: ({ row }) => {
                return <div className="row-bg-no-changed">{row.quantity_observed}</div>;
            }},
          ];
    }); 

   
    const filter_rows_from_products = (event, grid, __products, searchObj) => {
        const preventDefault = () => {
            event.preventDefault();
        };
        const { key } = event;

        if (key === "/") {
            preventDefault();
            return;
        }

        if (key === "ArrowDown") {
            grid.current.selectCell({ rowIdx: 0, idx: 4 }); 
            return;
        }

        grid.current.selectCell({ rowIdx: 0, idx: null }); 

        let keyin = searchObj.current?.value;
        let list_filtered = __products.filter((prod) => {
            if (prod) {
                let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                let has = prod.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                return  has ||
                    prod.code.toUpperCase().includes(keyin.toUpperCase());
            } else {
                return false;
            }
        });

        setRows(get_rows_from_products(list_filtered, order));
        SetProductFoundLeft(`${list_filtered.length} products found`);
        
        if (13 === event.keyCode) {
            event.target.select();
        }
        
    };


    const filter_rows_from_order = (event, grid, __lines, __search) => {
        const preventDefault = () => {
            event.preventDefault();
        };
        const { key } = event;

        if (key === "/") {
            preventDefault();
            return;
        }

        if (key === "ArrowDown") {
            grid.current.selectCell({ rowIdx: 0, idx: 3 }); 
            return;
        }

        grid.current.selectCell({ rowIdx: 0, idx: null }); 

        let keyin = __search.current?.value;
        let list_filtered = __lines.filter((prod) => {
            if (prod) {
                let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                let has = prod.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                return  has ||
                    prod.code.toUpperCase().includes(keyin.toUpperCase());
            } else {
                return false;
            }
        });

        setRowsOrder(get_rows_from_order(list_filtered, true));
        SetProductFoundRight(`${list_filtered.length} products found`);
        
        if (13 === event.keyCode) {
            event.target.select();
        }
        
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

    const rowChange = (rows, changes) => {
        // console.log(changes);
        // console.log(gridRef)
        // console.log(`Update: [${changes.column.key}]\n New Value: [${rows[changes.indexes[0]][changes.column.key]}]\n Where ID: [${rows[changes.indexes[0]].id}]`);

        const product_id = rows[changes.indexes[0]].id;
        const qty = rows[changes.indexes[0]][changes.column.key];
        const from_store_id = order.from_store.id;
        const to_store_id = order.to_store.id;
        const product_order_id = order.id;

        const pIndex = products_all_inv.findIndex(p => p.id == product_id);
        const cInventoryList = products_all_inv[pIndex].inventory;
        const cIndex = cInventoryList.findIndex(i => i.store.id == from_store_id);
        const available_quantity = cInventoryList[cIndex].prev_quantity;

        if (qty < 0) {
            alert('NON NEG QTY please');
            return;
        }

       if (available_quantity < qty) {
            alert('QUANTITY EXCEDED');
            return;
       }

        const args = {
            "product_id": product_id,
            "quantity": qty,
            "user_receiver": "USERHERE",
            "from_store": {
              "id": from_store_id
            },
            "to_store": {
              "id": to_store_id
            },
            "product_order_id": product_order_id
          }

        console.log(args);

        dispatch(addProductOrderLine(args))
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event, __search) => {
        const { key, shiftKey } = event; 

        const preventDefault = () => {
            event.preventGridDefault();
            event.preventDefault();
        };

        if (args.mode === 'EDIT') return;
        const { column, rowIdx, selectCell } = args;
        const { idx } = column;

        if (args.mode === 'SELECT' && key === "/" ) {
            preventDefault();
            __search.current.focus();
            return;
        }

        let currentDiv = event.target.parentElement;
        if (key === 'ArrowDown') {
            currentDiv = currentDiv.nextElementSibling;
        }

        if (key === 'ArrowUp') {
            currentDiv = currentDiv.previousElementSibling;
        }

        if(currentDiv != undefined) {
            const row_highlightsrow = (element) => {
                if (highlightsted.length == 1) {
                    highlightsted[0].classList.toggle('row-selected-bg');
                    highlightsted.pop();
                }
                highlightsted.push(element);
                element.classList.toggle('row-selected-bg');
            };
            row_highlightsrow(currentDiv);    
        }

    }

    const highlightsrow = (v, n) => {
        if (highlightsted.length == 1) {
            highlightsted[0].classList.toggle('row-selected-bg');
            highlightsted.pop();
        }

        const e = n.target.parentElement;
        highlightsted.push(e);
        e.classList.toggle('row-selected-bg');
    };
   
    return (
        <React.Fragment>
           {order != undefined &&
           <div className="movement" >
                <div className={`movement-${order.status}`}></div>
                <div className="movement-c">
                    <div className="info">
                        <h3>{order.from_store.name}</h3>
                        <small className="text-muted"> From Store </small>
                    </div>
                    <div className="info">
                        <h3>{order.to_store.name}</h3>
                        <small className="text-muted"> To Store </small>
                    </div>
                    <div className="info">
                        <h3>{order.status}</h3>
                        <small className="text-muted"> Order Status </small>
                    </div>
                    <div className="info">
                        <h3>{order.memo}</h3>
                        <small className="text-muted"> Memo</small>
                    </div>
                    <div className="info">
                        <h3 className="name-inv">{order.name}</h3>
                        <small className="text-muted"> Name </small>
                    </div>
                    <div className="info">
                        <h3>{order.value_in_order}</h3>
                        <small className="text-muted"> Value In Movement</small>
                    </div>
                    <div className="info">
                        <h3>{order.products_in_order} / {order.products_in_order_issue}</h3>
                        <small className="text-muted"> Products In Order / Issues</small>
                    </div>
                    <div className="info">
                        <h3>{order.date_opened} / {order.date_closed}</h3>
                        <small className="text-muted"> Date Open / Close</small>
                    </div>
                    <div className="info">
                        <h3>{order.user_requester} / {order.user_receiver}</h3>
                        <small className="text-muted">User Opener / Close</small>
                    </div>
                </div>
            </div>
            }
            <div className="movement-split-screen">
                <div>
                    <div className="search-terminal-c">
                        <div className="search-terminal">
                            <span className="material-icons-sharp"> search </span>
                            {orders.length > 0 && products_all_inv.length > 0 &&
                                <input ref={search} type="text" onKeyUp={(event) => filter_rows_from_products(event, gridRef, products_all_inv, search)} className="search-bar"  />
                            }
                            <span className="underline-animation-terminal"></span>
                        </div>
                        <small className="text-muted search-count"> {productFoundLeft} </small>
                    </div>
                    {/* {loading && <Loading Text="Loading :)" /> } */}
                    <DataGrid 
                            ref={gridRef}
                            columns={columns} 
                            rows={rows} 
                            onRowsChange={rowChange}
                            rowKeyGetter={rowKeyGetter} 
                            onCellKeyDown={(args, event) => handleCellKeyDown(args, event, search)}
                            enableVirtualization={true}
                            onCellClick={highlightsrow}
                            className="data-grid-movement rdg-dark"
                    />
                </div>
                <div>
                    <div className="search-terminal-c">
                        <div className="search-terminal">
                            <span className="material-icons-sharp"> search </span>
                            {orders.length > 0 && products_all_inv.length > 0 &&
                                <input ref={search_order} type="text" onKeyUp={(event) => filter_rows_from_order(event, gridRef_order, get_rows_from_order(order.product_order_line), search_order)} className="search-bar"  />
                            }
                            <span className="underline-animation-terminal"></span>
                        </div>
                        <small className="text-muted search-count"> {productFoundRight} </small>
                    </div>
                    <DataGrid 
                            ref={gridRef_order}
                            columns={columns_order} 
                            rows={rows_order} 
                            onRowsChange={rowChange}
                            rowKeyGetter={rowKeyGetter} 
                            onCellKeyDown={(args, event) => handleCellKeyDown(args, event, search_order)}
                            enableVirtualization={true}
                            onCellClick={highlightsrow}
                            className="data-grid-movement rdg-dark"
                    />
                </div>
            </div>
        </React.Fragment>
    )
};