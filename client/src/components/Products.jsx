import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor, SelectCellFormatter } from 'react-data-grid';
import { useDispatch , useSelector } from "react-redux";
import { refreshProductListAction, updateProduct } from "../redux/features/product.feature.js";

import 'react-data-grid/lib/styles.css';


export const Products = () => {
    const products = useSelector((state) => state.product.all_products);
    const pricing_labels = useSelector((state) => state.product.pricing_labels);
    const dispatch = useDispatch();
    const [cellNavigationMode, setCellNavigationMode] = useState('NONE');
    const [rows, setRows] = useState([]);
    const search = useRef();
    const gridRef = useRef(null);

   
    const columns = useMemo( () => {
        // const price_columns = [
        //     { key: 'DEFAULT', name: 'Default', editor: textEditor },
        //     { key: 'DISC_15', name: 'Discount -15%', editor: textEditor},
        //     { key: 'MEGA', name: 'Mega', editor: textEditor },
        // ];
        const price_columns = [];
        pricing_labels.forEach( label => {
            price_columns.push({ key: label.price_key, name: label.label, editor: textEditor, pricing_id: label.id});
            // return true;
        });

        // console.log(price_columns);
        

        const first_columns = [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Product', resizable: true, width: 400, editor: textEditor},
            { key: 'cost', name: 'Cost', editor: textEditor, width: 80 },
        ];

        return [
            {
                key: 'active', 
                name: 'Active', 
                width: 10, 
                formatter({ row, onRowChange, isCellSelected }) {
                    if(row == undefined) {
                        console.log('undefined row')
                    }
                return (
                  <SelectCellFormatter
                    value={row.active}
                    onChange={() => {
                      onRowChange({ ...row, active: !row.active });
                    }}
                    isCellSelected={isCellSelected}
                  />
                ); },
            },
            ...first_columns,
            ...price_columns,
            { key: 'code', name: 'SKU', width: 100, editor: textEditor },
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
                'price': product.price,
                'code': product.code,
                'active': product.active,
            };
            product.pricinglist.forEach(list => {
                const price = list.price;
                const pricelist_name = list.pricing.price_key;
                row[pricelist_name] = price;
            });
    
            _rows_.push(row)
        });
        return _rows_;
    };
   
    

    useEffect(()=> {
        let keyin = search.current?.value;
        console.log('keyin', keyin)
        if (keyin != '') {
            let list_filtered = products.filter((prod) => {
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
        } else {
            setRows(get_rows(products));
        }

    }, [products]);

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
            gridRef.current.selectCell({ rowIdx: 0, idx: 1 }); 
            return;
        }

        /** @BAWESOME trick fuck, rowIdx: 0, idx: null FIX the row undefined problem. */
        gridRef.current.selectCell({ rowIdx: 0, idx: null }); 
        // gridRef.current.element.blur();
        // ev.target.focus();
        
        // console.log(gridRef);

        let keyin = search.current?.value;
        let list_filtered = products.filter((prod) => {
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
    // TODO
    // bottomSummaryRows\

    const rowChange = (rows, changes) => {
        // console.log(changes);
        // console.log(rows)
        // console.log('---------------------------------------')
        console.log(`Update: [${changes.column.key}]\n New Value: [${rows[changes.indexes[0]][changes.column.key]}]\n Where ID: [${rows[changes.indexes[0]].id}]`);
        // console.log(rows[changes.indexes[0]])

        const pricing_id = (changes.column.pricing_id != undefined) ? changes.column.pricing_id : -1;

        const args = {
            'pricing_id': pricing_id,
            'field': changes.column.key,
            'value': rows[changes.indexes[0]][changes.column.key],
            'product_id': rows[changes.indexes[0]].id
        };

        dispatch(refreshProductListAction(args));
       
        dispatch(updateProduct(args))
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event) => {
        // console.log(args.mode);
        if (args.mode === 'EDIT') return;
        const { column, rowIdx, selectCell } = args;
        const { idx } = column;
        const { key, shiftKey } = event; 
    
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
            <div className="search-terminal">
                <span className="material-icons-sharp"> search </span>
                <input ref={search} type="text" onKeyUp={filter_rows} className="search-bar"  />
                <span className="underline-animation-terminal"></span>
            </div>
            <DataGrid 
                ref={gridRef}
                columns={columns} 
                rows={rows} 
                onRowsChange={rowChange}
                rowKeyGetter={rowKeyGetter} 
                onCellKeyDown={handleCellKeyDown}
                enableVirtualization={true}
                onCellClick={highlightsrow}
                className="data-grid-product rdg-dark"
            />
        </React.Fragment>
    )
};