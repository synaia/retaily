import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';

import { issueProductOrderLine, processOrder } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";
import { F_ } from "../util/Utils.js";

import 'react-data-grid/lib/styles.css';


export const PurchaseOrderResponse = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.product.purchase_orders);
    const [order, setOrder] = useState();
    const order_type = 'purchase';
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const loading = useSelector((state) => state.product.loading);
    const theme = useSelector((state) => state.user.theme);

    const [rows_order, setRowsOrder] = useState([]);

    const search_order = useRef();
    const gridRef_order = useRef(null);

    const [productFoundRight, SetProductFoundRight] = useState(0);


    const get_rows_from_order = (__lines, spread = false) => {
        const __rows = [];
        if (spread) {
            __lines.forEach(l => {
                const row = {
                    'id': l.id,
                    'name': l.name,
                    'code': l.code,
                    'quantity': l.quantity,
                    'quantity_observed': l.quantity_observed,
                    'status': l.status
                };
                __rows.push(row)
            });
        } else {
            __lines.forEach(l => {
                const row = {
                    'id': l.product.id,
                    'name': l.product.name,
                    'code': l.product.code,
                    'quantity': l.quantity,
                    'quantity_observed': l.quantity_observed,
                    'status': l.status
                };
                __rows.push(row)
            });
        }
        return __rows;
    };

    useEffect(() => {
        if (orders.length > 0) {
            const __order = orders.filter( o => { return o.id == params.order_id})[0];
            const __lines = __order.product_order_line;
            setOrder(__order);
    
            let keyin = search_order.current?.value;
            if (keyin != '') {
                let list_filtered = __lines.filter((prod) => {
                    if (prod) {
                        let exp = keyin.replace(/\ /g, '.+').toUpperCase();
                        let has = prod.product.name.toUpperCase().search(new RegExp(exp, "g")) > -1;
                        return  has ||
                            prod.product.code.toUpperCase().includes(keyin.toUpperCase());
                    } else {
                        return false;
                    }
                });
                setRowsOrder(get_rows_from_order(list_filtered, false));
                SetProductFoundRight(`${list_filtered.length} products found`);
            } else {
                setRowsOrder(get_rows_from_order( __order.product_order_line));
                SetProductFoundRight(`${__order.product_order_line.length} products in total`);
            }
            search_order.current.select();
            search_order.current.focus();
        }
    }, [orders]);


    const columns_order = useMemo( () => {
       
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Product', resizable: true, width: 300},
            { key: 'code', name: 'SKU', width: 100 },
            { key: 'quantity', name: 'Quantity',  width: 100, formatter: ({ row }) => {
                const row_bg_issue = (row.status === "issue") ? 'row-bg-issue' : 'row-bg-no-changed'
                return <div className={row_bg_issue}>{row.quantity}</div>;
            }},
            { key: 'quantity_observed', name: 'Quantity Received',  editor: textEditor, width: 200, formatter: ({ row }) => {
                return <div className="row-bg-no-changed">{row.quantity_observed}</div>;
            }},
          ];
    }); 

   
    const filter_rows_from_order = (event, grid, __lines, __search) => {
        const preventDefault = () => {
            event.preventDefault();
        };
        const { key } = event;

        if (key === "/") {
            preventDefault();
            return;
        }

        if (key === 'ArrowDown' || key === 'Enter') {
            grid.current.selectCell({ rowIdx: 0, idx: 4 }); 
            preventDefault();
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
        if (order.status == "closed") {
            console.log('order closed bye.');
            return;
        }
        const product_id = rows[changes.indexes[0]].id;
        const __quantity = rows[changes.indexes[0]].quantity;
        const qty = rows[changes.indexes[0]][changes.column.key];
        const from_origin_id = order.from_store.id; // order is set???
        const to_store_id = order.to_store.id;
        const product_order_id = order.id;

    //     if (qty < 0) {
    //         alert('NON NEG QTY please');
    //         return;
    //     }

    //    if (available_quantity < qty) {
    //         alert('QUANTITY EXCEDED');
    //         return;
    //    }

        const args = {
            "product_id": product_id,
            "quantity": __quantity,
            "quantity_observed": qty,
            "user_receiver": "USERRESPONSER",
            "receiver_memo": "some memo here",
            "product_order_id": product_order_id,
            "order_type": order_type
          }

        console.log(changes)
        console.log(args);

        dispatch(issueProductOrderLine(args))
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event, __search) => {
        const { key, shiftKey } = event; 
        const { column, rowIdx, selectCell } = args;
        const { idx } = column;

        const preventDefault = () => {
            event.preventGridDefault();
            event.preventDefault();
        };

        // if (args.mode === 'EDIT' && key === 'Enter') {
        //     preventDefault();
        //     __search.current.focus();
        //     return;
        // }

        if (args.mode === 'EDIT') return;


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

        const fixedIdx = 4;
        const arrowKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
        const loopOverColumnNavigation = () => {
            if (arrowKeys.includes(key)) {
                let newRowIdx;
                if (fixedIdx !== idx) {
                    newRowIdx = rowIdx;
                } else if (rowIdx === -1 && (key === 'ArrowDown' || key === 'ArrowRight')) {
                    newRowIdx = 0;
                } else {
                    newRowIdx = (key === 'ArrowUp' || key === 'ArrowLeft') ? rowIdx - 1 : rowIdx === rows_order.length - 1 ? rowIdx : rowIdx + 1;
                }
                selectCell({ rowIdx: newRowIdx, 'idx': fixedIdx });
                preventDefault();
            }
        };

        loopOverColumnNavigation();
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

    const __processOrder = () => {
        const args = {
            'id': order.id,
            'user_receiver': 'USERLOGUED',
            "order_type": order_type
        }
        dispatch(processOrder(args));
    };

    let receive_button = '';
    if (order != undefined) {
        if (order.status == "opened" || order.status == "inprogress" ) {
            receive_button =  <div>
                                <button className="fbutton fbutton-price-list" onClick={() => __processOrder()}>
                                    <span className="material-icons-sharp"> verified </span>
                                    <span>RECEIVE THE ORDER</span>
                                </button>
                            </div>;
        }
    }
    
   
    return (
        <React.Fragment>
           {order != undefined &&
           <div className="movement" >
                <div className={`movement-${order.status}`}></div>
                <div className="movement-c">
                    <div className="info">
                        <h3>{order.from_store.name}</h3>
                        <small className="text-muted"> From Provider </small>
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
                        <h3>{F_(order.value_in_order)}</h3>
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
                {receive_button}
            </div>
            }
            <div className="search-terminal-c">
                <div className="search-terminal">
                    <span className="material-icons-sharp"> search </span>
                    {orders.length > 0 &&
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
                    className={`data-grid-movement ${theme.grid_theme}`}
            />
        </React.Fragment>
    )
};