import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import { textEditor } from 'react-data-grid';

import { issueProductOrderLine, processOrder, getPurchaseProductOrders } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";
import { F_ } from "../util/Utils.js";

import 'react-data-grid/lib/styles.css';


export const OrderBulkResponse = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const bulk_orders = useSelector((state) => state.product.bulk_orders);
    const [bulk, setBulk] = useState();
    const order_type = 'purchase';
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const loading = useSelector((state) => state.product.loading);
    const theme = useSelector((state) => state.user.theme);

    const [rows_order, setRowsOrder] = useState([]);

    const search_order = useRef();
    const gridRef_order = useRef(null);

    const [productFoundRight, SetProductFoundRight] = useState(0);

    const [product_filtered, set_product_filtered] = useState();
    const qty_scanned_product = useRef();
    const scannbarcode_ref = useRef("");



    const onKewyDownEvent = (event) => {
        const { key } = event
        const activeElement = document.activeElement
        const milliSeconds = 10
       
        if(!window.hasOwnProperty('scan')) {
            window.scan = []
        }

        if(window.scan.length > 0 ) {
            if ((event.timeStamp - window.scan.slice(-1)[0].timeStamp) > milliSeconds) {
                window.scan = []

                console.log('slow ... ', key)

                if (key === "Enter" && activeElement.type !== undefined) {
                    if (scannbarcode_ref != undefined && scannbarcode_ref.current != null) {
                        if (activeElement.type === 'text' && scannbarcode_ref.current.value.length > 5) {
                            console.log('a buscar .... ', scannbarcode_ref.current.value)
                            lookupProduct(scannbarcode_ref.current.value, bulk_orders, scannbarcode_ref)
                        } else if (activeElement.type === 'number' && scannbarcode_ref.current.value.length > 5) {
                            const __product_filtered = lookupProduct(scannbarcode_ref.current.value, bulk_orders, scannbarcode_ref, false)
                            console.log('Proceed to changes...')
                            bulkyChange(__product_filtered)
                        } else {
                            console.log('Not expecting behavior.')
                        }
                    }
                }
                
            } else {
                console.log('fast ... ', key)
                if (activeElement.type !== undefined) {
                    if (activeElement.type === 'text') {
                        activeElement.value = '';
                        event.preventDefault()
                    }
                }
                
            }  
        } else {
            console.log('window.scan.length < 0 ', key)
        }

        if(key === "Enter" && window.scan.length > 0) {
            let scannedString = window.scan.reduce((scannedString, entry) => {
                return scannedString + entry.key
            }, "")
            window.scan = []
            console.log('scannedString => ', scannedString)
            lookupProduct(scannedString, bulk_orders, scannbarcode_ref)

            // return document.dispatchEvent(new CustomEvent('scanComplete', {detail: scannedString}))
        }
        
        if(key !== "Shift") {
            // push `key`, `timeStamp` and calculated `timeStampDiff` to scan array
            let data = JSON.parse(JSON.stringify(event, ['key', 'timeStamp']))
            data.timeStampDiff = window.scan.length > 0 ? data.timeStamp - window.scan.slice(-1)[0].timeStamp : 0;
    
            window.scan.push(data)           
        }
    }

    useEffect(() => {
        if (bulk_orders.length > 0 ) {
            console.log('useEffect -> addEventListener')
            document.addEventListener('keydown', onKewyDownEvent);
        }
        return () => {
            console.log('useEffect -> removeEventListener')
            document.removeEventListener('keydown', onKewyDownEvent);
        }
    }, [bulk_orders]);

    const lookupProduct = (barcode, __bulk_orders, ref, fillinputs = true) => {
        if (ref !== undefined && ref.current !== null) {
            if (__bulk_orders.length > 0) {
                const __bulk = __bulk_orders.filter( bulk => { return bulk.bulk_order_id == params.bulk_id})[0];
                const __lines = __bulk.lines;
                let __product_filtered = __lines.filter((prod) => {
                    if (prod) {
                        return prod.product.code.toUpperCase().includes(barcode.toUpperCase());
                    } else {
                        return false;
                    }
                });
                // console.log(__product_filtered[0]);
                qty_scanned_product.current.focus();
                if (__product_filtered[0] !== undefined) {
                    set_product_filtered(__product_filtered[0]);
                    if (fillinputs) {
                        qty_scanned_product.current.value = __product_filtered[0].quantity_observed;
                        ref.current.value = barcode;
                    }
                    return __product_filtered[0] 
                } else {
                    qty_scanned_product.current.value = 0;
                }
            }
            ref.current.value = barcode;
        }
        return undefined
   }


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
        if (bulk_orders.length > 0) {
            const __bulk = bulk_orders.filter( bulk => { return bulk.bulk_order_id == params.bulk_id})[0];
            const __lines = __bulk.lines;
            setBulk(__bulk);
    
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
                setRowsOrder(get_rows_from_order( __lines));
                SetProductFoundRight(`${__lines.length} products in total`);
            }
            search_order.current.select();
            // search_order.current.focus();
        }
    }, [bulk_orders]);


    const columns_order = useMemo( () => {
        return [
            { key: 'name', name: 'Product', resizable: true, width: 200},
            { key: 'code', name: 'SKU', width: 100 },
            { key: 'quantity', name: 'Qty',  width: 100, formatter: ({ row }) => {
                const row_bg_issue = (row.status === "issue") ? 'row-bg-issue' : 'row-bg-no-changed'
                return <div className={row_bg_issue}>{row.quantity}</div>;
            }},
            { key: 'quantity_observed', name: 'Qty. Received',  editor: textEditor, width: 100, formatter: ({ row }) => {
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

    const bulkyChange = (__product) => {

        console.log(__product)
        const qty_new = qty_scanned_product.current.value

        if(__product.quantity == qty_new) {
            //TODO: call OK method.
            // here.... 
            console.log('TODO: call OK method');

            // USE adecuate method.
            const args = {
                "product_id": __product.product.id,
                "quantity": __product.quantity,
                "quantity_observed": qty_new,
                "user_receiver": "USERSCANN",
                "receiver_memo": "A GREAT BARCODE SCANNER MESSAGE",
                "product_order_id": __product.product_order_id,
                "order_type": order_type
              }
    
            console.log(args);
    
            dispatch(issueProductOrderLine(args))

        } else {
            const args = {
                "product_id": __product.product.id,
                "quantity": __product.quantity,
                "quantity_observed": qty_new,
                "user_receiver": "USERSCANN",
                "receiver_memo": "A GREAT BARCODE SCANNER MESSAGE",
                "product_order_id": __product.product_order_id,
                "order_type": order_type
              }
    
            console.log(args);
    
            dispatch(issueProductOrderLine(args))
        }

    }

    const rowChange = (rows, changes) => {
        if (bulk.status == "closed") {
            console.log('order closed bye.');
            return;
        }
        const product_id = rows[changes.indexes[0]].id;
        const __quantity = rows[changes.indexes[0]].quantity;
        const qty = rows[changes.indexes[0]][changes.column.key];
        const from_origin_id = bulk.from_store.id; // order is set???
        const to_store_id = bulk.to_store.id;
        const product_order_id = bulk.id;

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
            'id': bulk.id,
            'user_receiver': 'USERLOGUED'
        }
        dispatch(processOrder(args));
    };
    
   
    return (
        <React.Fragment>
            <div className="bulk-screen">
                <div>
                    <div className="search-terminal-bulk">
                        <div className="search-terminal-blk">
                            <span className="material-symbols-sharp">barcode_scanner</span>
                            <input ref={scannbarcode_ref} type="text" className="search-bar-scann-bulk"  />
                            <span className="underline-animation-terminal-blk"></span>
                        </div>
                    </div>
                    {product_filtered != undefined &&
                        <div className="product-scanned">
                            <div className="info">
                                <h3>{product_filtered.product.name}</h3>
                                <small className="text-muted"> Name </small>
                            </div>
                            <div className="info">
                                <h3>{product_filtered.quantity}</h3>
                                <small className="text-muted"> Qty. </small>
                            </div>
                        </div>
                    }
                    <div>
                        <input type="number" className="qty-scanned-product"
                                ref={qty_scanned_product}
                        />
                    </div>
                </div>
                <div>
                    <div className="search-terminal-c">
                        <div className="search-terminal">
                            <span className="material-icons-sharp"> search </span>
                            {bulk_orders.length > 0 &&
                                <input ref={search_order} type="text" onKeyUp={(event) => filter_rows_from_order(event, gridRef_order, get_rows_from_order(bulk.lines), search_order)} className="search-bar-t"  />
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
                            className={`data-grid-bulk ${theme.grid_theme}`}
                    />
                </div>
            </div>
        </React.Fragment>
    )
};