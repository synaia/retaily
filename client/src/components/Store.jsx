import React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor, SelectCellFormatter } from 'react-data-grid';
import { Row } from "react-data-grid";

import { getProductsByInventory, openInventory, closeInventory, cancelInventory, getInventoryHead, updateNextQty, getStoresInv } from "../redux/features/product.feature.js";
import { Loading } from "./Loading.jsx";
import { F_, validateInputX } from "../util/Utils.js";



import 'react-data-grid/lib/styles.css';


export const Store = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigator = useNavigate()
    const products_inv = useSelector((state) => state.product.products_inv);
    const resume_inv = useSelector((state) => state.product.resume_inv);
    const changed_count = useSelector((state) => state.product.changed_count);
    const inv_valuation = useSelector((state) => state.product.inv_valuation);
    const inv_valuation_changed = useSelector((state) => state.product.inv_valuation_changed);
    const inventory_head = useSelector((state) => state.product.inventory_head);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const loading = useSelector((state) => state.product.loading);
    const theme = useSelector((state) => state.user.theme);

    const [cellNavigationMode, setCellNavigationMode] = useState('NONE');
    const [rows, setRows] = useState([]);

    const search = useRef();
    const gridRef = useRef(null);
    const current = new Date();
    const inv_default_name = `INV-${current.toISOString().substring(0, 10)}`;
    const inv_name = useRef();
    const inv_memo = useRef();
    const inv_progress = useRef();

    const [errorLabel, SetErrorLabel] = useState(null);
    const [errorPriceKey, SetErrorPriceKey] = useState(null);
    const [errorPercent, SetErrorPercent] = useState(null);

    const [valuation, SetValuation] = useState(null);
    const [valuationChanged, SetValuationChanged] = useState(null);
    const [changedCount, SetChangedCount] = useState(0);
    const [daysBack, SetDaysBack] = useState(0);
    const [daysBackIcon, SetDaysBackIcon] = useState("");

    const [errorInvMemo, SetErrorInvMemo] = useState(null);
    const [errorInvName, SetErrorInvName] = useState(null);

    const [is_inventory_open, set_inventory_open] = useState(false);

    const [productFound, SetProductFound] = useState(0);


    useEffect(()=> {
        console.log('resume_inv', resume_inv)
        if (resume_inv[params.store_name] != undefined) {
            SetValuation(resume_inv[params.store_name].inv_valuation);
            SetValuationChanged(resume_inv[params.store_name].inv_valuation_changed);
            SetChangedCount(resume_inv[params.store_name].changed_count);
        }
    }, [resume_inv]);


    useEffect(() => {
        dispatch(getProductsByInventory(params.store_name));
        dispatch(getInventoryHead(params.store_name));
        dispatch(getStoresInv());
    }, []);

    useEffect(() => {
        inv_name.current.value = inventory_head.name == undefined ? inv_default_name : inventory_head.name ;
        inv_memo.current.value = inventory_head.memo;
        if (inventory_head.date_create != undefined) {
            const currentDate = new Date();
            const date_create = new Date(inventory_head.date_create);
            const days_back = currentDate.getDate() - date_create.getDate();
            SetDaysBack(days_back);
            if (days_back == 0) {
                SetDaysBackIcon("thumb_up");
            } else if (days_back >= 1 && days_back <= 2 ) {
                SetDaysBackIcon("sentiment_very_dissatisfied");
            } else if (days_back >= 3 ) {
                SetDaysBackIcon("local_fire_department");
            }
        } else {
            SetDaysBack(0);
            SetDaysBackIcon("");
        }
    }, [inventory_head])

    // useEffect(() => {
    //     inv_progress.current.value = inventory_head.status == 0 ? `${changed_count} In Progress` : "Close";
    // }, [changed_count]);

    useEffect(() => {
        console.log('inventory_head', inventory_head);
        set_inventory_open(inventory_head.id != undefined);
        // if (inventory_head.id != undefined) {
        //     set_inventory_open(inventory_head.date_close == undefined)
        // } else {
        //     set_inventory_open(false);
        // }
    }, [inventory_head]);

    const __openInventory = () => {
        if (!validateInputX(inv_name, "str", SetErrorInvName)) {
            return;
        }
        if (!validateInputX(inv_memo, "str", SetErrorInvMemo)) {
            return;
        }
        const head = {
            name: inv_name.current?.value,
            memo: inv_memo.current?.value,
            store: products_inv[0].inventory[0].store
        }
        dispatch(openInventory(head))
        dispatch(getProductsByInventory(params.store_name));
        set_inventory_open(true);
    };

    const __closeinventory = () => {
        if (!confirm('ARE YOU SURE?')) {
            return;
        }
        const store  = products_inv[0].inventory[0].store;
        dispatch(closeInventory(store));
        dispatch(getProductsByInventory(params.store_name));
        dispatch(getInventoryHead(params.store_name));
        set_inventory_open(false);
    };

    const __cancelInventory = () => {
        if (!confirm('CANCEL THIS INVENTORY ... ARE YOU SURE?')) {
            return;
        }
        const store  = products_inv[0].inventory[0].store;
        dispatch(cancelInventory(store));
        dispatch(getProductsByInventory(params.store_name));
        dispatch(getInventoryHead(params.store_name));
        set_inventory_open(false);
    };


    const columns = useMemo( () => {
        // const price_columns = [
        //     { key: 'DEFAULT', name: 'Default', editor: textEditor },
        //     { key: 'DISC_15', name: 'Discount -15%', editor: textEditor},
        //     { key: 'MEGA', name: 'Mega', editor: textEditor },
        // ];
        // const price_columns = [];
        // pricing_labels.forEach( label => {
        //     price_columns.push({ key: label.price_key, name: label.label, editor: textEditor, pricing_id: label.id});
        //     // return true;
        // });

        // console.log(price_columns);

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
                { key: 'name', name: 'Product', resizable: true, width: 400},
                { key: 'code', name: 'SKU', width: 100 },
                { key: 'cost', name: 'Cost', width: 100 },
                { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                    return <div className="row-bg-no-changed">{row.quantity}</div>;
                }},
                next_quantity
              ];
        } else {
            return [
                { key: 'id', name: 'ID', width: 10 },
                { key: 'name', name: 'Product', resizable: true, width: 400},
                { key: 'code', name: 'SKU', width: 100 },
                { key: 'cost', name: 'Cost', width: 100 },
                { key: 'quantity', name: 'Quantity', width: 100, formatter: ({ row }) => {
                    return <div className="row-bg-no-changed">{row.quantity}</div>;
                }},
              ];
        }
        
    }); 


    const get_rows = (_prodducts_) => {
        console.log('get_rows()')
        // if (_prodducts_[0] != undefined) {
        //     console.log(_prodducts_[0].inventory);
        // }
        
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


    useEffect(()=> {
        let keyin = search.current?.value;
        console.log('keyin', keyin)
        if (keyin != '') {
            let list_filtered = products_inv.filter((prod) => {
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
            setRows(get_rows(products_inv));
            SetProductFound(`${products_inv.length} products in total`);
        }

        // const changed = products_inv.filter(p => p.inventory[0].status === "changed");
        // set_inchanged(changed.length)
        // console.log(changed.length)


    }, [products_inv]);


    const filter_rows = (event) => { 
        const preventDefault = () => {
            event.preventDefault();
        };
        // console.log(ev);
        const { key } = event;

        if (key === "/") {
            preventDefault();
            return;
        }

        if (key === "ArrowDown") {
            gridRef.current.selectCell({ rowIdx: 0, idx: 4 }); 
            return;
        }

        /** @BAWESOME trick fuck, rowIdx: 0, idx: null FIX the row undefined problem. */
        gridRef.current.selectCell({ rowIdx: 0, idx: null }); 
        // gridRef.current.element.blur();
        // ev.target.focus();
        
        // console.log(gridRef);

        let keyin = search.current?.value;
        let list_filtered = products_inv.filter((prod) => {
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
        // console.log(rows)
        // console.log('---------------------------------------')
        console.log(`Update: [${changes.column.key}]\n New Value: [${rows[changes.indexes[0]][changes.column.key]}]\n Where ID: [${rows[changes.indexes[0]].id}]`);
        // console.log(rows[changes.indexes[0]])

        const product_id = rows[changes.indexes[0]].id;
        const index = products_inv.findIndex(prod => prod.id == product_id);
        const prod = products_inv[index];


        const args = {
            'field': changes.column.key,
            'prev_quantity': prod.inventory[0].quantity,
            'next_quantity': rows[changes.indexes[0]][changes.column.key],
            'user_updated': 'user#1',
            'product_id': product_id,
            'store_id': products_inv[0].inventory[0].store.id
        };

        console.log(args);

        dispatch(updateNextQty(args));
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event) => {
        // console.log(args.mode);
        const { key, shiftKey } = event; 

        // TODO: change cell bg is a headache.
        // if (key === "Enter" && args.mode === 'EDIT') {
        //     event.target.parentElement.parentElement.classList.add('danger');
        // }

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
    
    const rowRenderer = ({ renderBaseRow, ...props }) => {
        console.log(props.idx)
    }
   
    return (
        <React.Fragment>
            <div className="store-header">
                <div className="info">
                <h2>{params.store_name}</h2>
                    <small className="text-muted"> Store </small>
                </div>
                <div className="info">
                    <h2>{F_(valuation)}</h2>
                    <small className="text-muted"> Value Inventory </small>
                </div>
                <div className="info">
                    <h2>{F_(valuationChanged)}</h2>
                    <small className="text-muted"> Value Inventory Changed</small>
                </div>
                <div className="info">
                    <h2>{changedCount}</h2>
                    <small className="text-muted"> Changed Count</small>
                </div>
                <div className="info">
                    <h2>{daysBack}</h2>
                    <small className="text-muted">Days Open</small>
                </div>
                <div className="info">
                    <span className="material-icons-sharp"> {daysBackIcon} </span>
                    <small className="text-muted"></small>
                </div>
            </div>
            <div className="price-list">
                <div>
                    <span>Name</span>
                    <div className="price-list-b">
                        <span className="material-icons-sharp price-list-i"> more_vert </span>
                        {/* {!loading && */}
                            <input type="text" ref={inv_name} className="price-list-t" 
                               />
                        {/* } */}
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorInvName}</span>
                </div>
                <div>
                    <span>Memo</span>
                    <div className="price-list-b">
                        <span className="material-icons-sharp price-list-i"> more_vert </span>
                        {/* {!loading && */}
                            <input type="text" ref={inv_memo}  className="price-list-t"  />
                        {/* } */}
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorInvMemo}</span>
                </div>
                {/* <div>
                     <span>Status</span>
                     <div className="price-list-b">
                         <span className="material-icons-sharp price-list-i"> more_vert </span>
                         <input type="text"  ref={inv_progress} className="price-list-t"  />
                         <span className="underline-animation"></span>
                     </div>
                     <span className="error-msg">{errorPriceKey}</span>
                </div> */}
                <div>
                {!loading && !is_inventory_open &&
                    <button className="fbutton fbutton-price-list" onClick={() => __openInventory()}>
                        <span className="material-icons-sharp"> build </span>
                        <span>OPEN INVENTORY</span>
                    </button>
                }
                {!loading && is_inventory_open &&
                    <button className="fbutton fbutton-price-list" onClick={() => __closeinventory()}>
                        <span className="material-icons-sharp"> verified </span>
                        <span>CLOSE INVENTORY IN PROGRESS</span>
                    </button>
                }
                </div>
                {!loading && is_inventory_open &&
                <div>
                    <button className="fbutton fbutton-price-list" onClick={() => __cancelInventory()}>
                        <span className="material-icons-sharp"> waving_hand </span>
                        <span>CANCEL THIS INVENTORY</span>
                    </button>
                </div>
                }
            </div>
            <div className="search-terminal-c">
                <div className="search-terminal">
                    <span className="material-icons-sharp"> searchk </span>
                    <input ref={search} type="text" onKeyUp={filter_rows} className="search-bar"  />
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
                    className={`data-grid-product ${theme.grid_theme}`}
            />
        </React.Fragment>
    )
};