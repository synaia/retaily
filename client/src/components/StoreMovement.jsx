import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';

import { getProductsByInventory, openInventory, closeInventory, cancelInventory, getInventoryHead, updateNextQty, getStoresInv } from "../redux/features/product.feature.js";
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

    const [is_inventory_open, set_inventory_open] = useState(true);

    const [productFound, SetProductFound] = useState(0);

    useEffect(() => {
        if (orders.length > 0) {
            const order = orders.filter( o => { return o.id == params.order_id})[0];
            setOrder(order)
            setRowsOrder(get_rows_order(order));
            console.log(order)
        }
    }, [orders]);


    const columns = useMemo( () => {
        const next_quantity = { 
            key: 'next_quantity', 
            name: 'New Quantity', 
            width: 100, 
            editor: textEditor, 
            formatter: ({ row }) => {
                if (row.status == "changed") {
                    return <div className="row-bg-changed">{row.next_quantity}</div>;
                } else {
                    return <div className="row-bg-no-changed">{row.next_quantity}</div>;
                }
            }  };

        if (is_inventory_open) {
            return [
                { key: 'id', name: 'ID', width: 10 },
                { key: 'name', name: 'Product', resizable: true, width: 300},
                { key: 'code', name: 'SKU', width: 100 },
                { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                    return <div className="row-bg-no-changed">{row.quantity}</div>;
                }},
                next_quantity
              ];
        } else {
            return [
                { key: 'id', name: 'ID', width: 10 },
                { key: 'name', name: 'Product', resizable: true, width: 300},
                { key: 'code', name: 'SKU', width: 100 },
                { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                    return <div className="row-bg-no-changed">{row.quantity}</div>;
                }},
              ];
        }
        
    }); 


    const columns_order = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Product', resizable: true, width: 300},
            { key: 'code', name: 'SKU', width: 100 },
            { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                return <div className="row-bg-no-changed">{row.quantity_observed}</div>;
            }},
          ];
    }); 


    const get_rows = (_prodducts_) => {
        console.log('get_rows()')
        const _rows_ = [];
        _prodducts_.forEach(product => {
            const row = {
                'id': product.id,
                'name': product.name,
                'cost': product.cost,
                'code': product.code,
                'quantity': product.inventory[0].quantity,
                'next_quantity': product.inventory[0].next_quantity, 
                'status': product.inventory[0].status
            };
            _rows_.push(row)
        });
        return _rows_;
    };

    const get_rows_order = (_order_) => {
        const line  = _order_.product_order_line;
        const _rows_ = [];
        line.forEach(l => {
            const row = {
                'id': l.product.id,
                'name': l.product.name,
                'code': l.product.code,
                'quantity_observed': l.quantity_observed
            };
            _rows_.push(row)
        });
        return _rows_;
    };


    useEffect(()=> {
        let keyin = search.current?.value;
        console.log('keyin', keyin)
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
            setRows(get_rows(list_filtered));
            SetProductFound(`${list_filtered.length} products found`);
        } else {
            setRows(get_rows(products_all_inv));
            SetProductFound(`${products_all_inv.length} products in total`);
        }
    }, [products_all_inv]);


    const filter_rows = (event, grid, rowList, searchObj, _get_rows_func) => {
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

        let keyin = searchObj.current?.value;
        let list_filtered = rowList.filter((prod) => {
            if (prod) {
                let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                let has = prod.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                return  has ||
                    prod.code.toUpperCase().includes(keyin.toUpperCase());
            } else {
                return false;
            }
        });

        setRows(_get_rows_func(list_filtered));
        SetProductFound(`${list_filtered.length} products found`);
        
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

        console.log(changes);
        console.log(gridRef)
        console.log(`Update: [${changes.column.key}]\n New Value: [${rows[changes.indexes[0]][changes.column.key]}]\n Where ID: [${rows[changes.indexes[0]].id}]`);

        const product_id = rows[changes.indexes[0]].id;
        const index = products_all_inv.findIndex(prod => prod.id == product_id);
        const prod = products_all_inv[index];


        const args = {
            'field': changes.column.key,
            'prev_quantity': prod.inventory[0].quantity,
            'next_quantity': rows[changes.indexes[0]][changes.column.key],
            'user_updated': 'user#1',
            'product_id': product_id,
            'store_id': products_all_inv[0].inventory[0].store.id
        };

        console.log(args);
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event) => {
        // console.log(args.mode);
        const { key, shiftKey } = event; 

        if (args.mode === 'EDIT') return;
        const { column, rowIdx, selectCell } = args;
        const { idx } = column;
    
        const preventDefault = () => {
          event.preventGridDefault();
          event.preventDefault();
        };

        if (args.mode === 'SELECT' && key === "/" ) {
            preventDefault();
            search.current.focus();
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
       
        const loopOverNavigation = () => {
          if ((key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) && idx === columns.length - 1) {
            selectCell({ rowIdx, idx: 0 });
            preventDefault();
          } else if ((key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) && idx === 0) {
            selectCell({ rowIdx, idx: columns.length - 1 });
            preventDefault();
          }
        };

        const changeRowNavigation = () => {
            if (key === 'ArrowRight' && idx === columns.length - 1) {
              if (rows.length === 0) return;
              if (rowIdx === -1) {
                selectCell({ rowIdx: 0, idx: 0 });
              } else {
                if (rowIdx === rows.length - 1) return;
                selectCell({ rowIdx: rowIdx + 1, idx: 0 });
              }
              preventDefault();
            } else if (key === 'ArrowLeft' && idx === 0) {
              if (rowIdx === -1) return;
              selectCell({ rowIdx: rowIdx - 1, idx: columns.length - 1 });
              preventDefault();
            }
        };

        const loopOverColumnNavigation = () => {
            let newRowIdx;
            if (rowIdx === -1) {
              newRowIdx = shiftKey ? rows.length - 1 : 0;
            } else {
              newRowIdx = shiftKey ? rowIdx - 1 : rowIdx === rows.length - 1 ? -1 : rowIdx + 1;
            }
            selectCell({ rowIdx: newRowIdx, idx });
            preventDefault();
        };

        if (cellNavigationMode === 'LOOP_OVER_ROW') {
            loopOverNavigation();
        } else if (cellNavigationMode === 'CHANGE_ROW') {
            changeRowNavigation();
        } else if (cellNavigationMode === 'LOOP_OVER_COLUMN' && key === 'Tab') {
            loopOverColumnNavigation();
        } else if (cellNavigationMode === 'NO_TAB' && key === 'Tab') {
            // Need to allow default event to focus the next element
            event.preventGridDefault();
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
                            <input ref={search} type="text" onKeyUp={(event) => filter_rows(event, gridRef, products_all_inv, search, get_rows)} className="search-bar"  />
                            <span className="underline-animation-terminal"></span>
                        </div>
                        <small className="text-muted search-count"> {productFound} </small>
                    </div>
                    {/* {loading && <Loading Text="Loading :)" /> } */}
                    <DataGrid 
                            ref={gridRef}
                            columns={columns} 
                            rows={rows} 
                            onRowsChange={rowChange}
                            rowKeyGetter={rowKeyGetter} 
                            onCellKeyDown={handleCellKeyDown}
                            enableVirtualization={true}
                            onCellClick={highlightsrow}
                            className="data-grid-movement rdg-dark"
                    />
                </div>
                <div>
                    <div className="search-terminal-c">
                        <div className="search-terminal">
                            <span className="material-icons-sharp"> search </span>
                            <input ref={search_order} type="text" onKeyUp={(event) => filter_rows(event, gridRef_order, get_rows_order(order), search_order, get_rows_order)} className="search-bar"  />
                            <span className="underline-animation-terminal"></span>
                        </div>
                        <small className="text-muted search-count"> {productFound} </small>
                    </div>
                    <DataGrid 
                            ref={gridRef_order}
                            columns={columns_order} 
                            rows={rows_order} 
                            rowKeyGetter={rowKeyGetter} 
                            onCellKeyDown={handleCellKeyDown}
                            enableVirtualization={true}
                            onCellClick={highlightsrow}
                            className="data-grid-movement rdg-dark"
                    />
                </div>
            </div>
        </React.Fragment>
    )
};