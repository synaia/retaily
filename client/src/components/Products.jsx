import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor } from 'react-data-grid';
import { useDispatch , useSelector } from "react-redux";
import { refreshProductListAction, updateProduct } from "../redux/features/product.feature.js";

import 'react-data-grid/lib/styles.css';


export const Products = () => {
    const products = useSelector((state) => state.product.products);
    const dispatch = useDispatch();
    const [cellNavigationMode, setCellNavigationMode] = useState('NONE');
    const [rows, setRows] = useState([]);
    const search = useRef();
    const gridRef = useRef(null);

    const columns = useMemo(() => {
        return [
            { key: 'id', name: 'ID', resizable: true, width: 10 },
            { key: 'name', name: 'Product', width: 400, editor: textEditor},
            { key: 'cost', name: 'Cost', editor: textEditor },
            { key: 'price', name: 'Price', editor: textEditor },
            { key: 'code', name: 'SKU', editor: textEditor },
            { key: 'quantity', name: 'QTY', width: 10 },
          ];
    }); 
    
    const _rows_ = [];
    products.forEach(product => {
        let row = {
            'id': product.id,
            'name': product.name,
            'cost': product.cost,
            'price': product.price,
            'code': product.code,
            'quantity': product.inventory.quantity,
        };
        _rows_.push(row)
    });

    useEffect(()=> {
        setRows(_rows_);
    }, [products]);

    const filter_rows = (ev) => {
        // gridRef.setState({ selected: { rowIdx: 0, idx: 0 } });
        gridRef.current.selectCell({ rowIdx: null, idx: null }); // trick fuck
        // gridRef.current.element.blur();
        // ev.target.focus();
        
        console.log(gridRef);

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

        setRows(list_filtered);
        
        
        if (13 === ev.keyCode) {
            ev.target.select();
        }
        
    };


    useEffect(() => {
        console.log('rows.length: ', rows.length);
    }, [rows]);

    const rowKeyGetter = (row) => {
        return row.id;
    };
    // TODO
    // bottomSummaryRows\

    const rowChange = (rows, changes) => {
        // console.log(rows)
        // console.log('---------------------------------------')
        console.log(`Update: [${changes.column.key}]\n New Value: [${rows[changes.indexes[0]][changes.column.key]}]\n Where ID: [${rows[changes.indexes[0]].id}]`);
        // console.log(rows[changes.indexes[0]])
        dispatch(refreshProductListAction(rows));


        const args = {
            'field': changes.column.key,
            'value': rows[changes.indexes[0]][changes.column.key],
            'product_id': rows[changes.indexes[0]].id
        };
        dispatch(updateProduct(args))
    };

    const highlightsted = [];

    const handleCellKeyDown = (args, event) => {
        // console.log(args);
        if (args.mode === 'EDIT') return;
        const { column, rowIdx, selectCell } = args;
        const { idx } = column;
        const { key, shiftKey } = event;
    
        const preventDefault = () => {
          event.preventGridDefault();
          event.preventDefault();
        };

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

    const testFunc = (v) => {
        console.log('testFunc: ', v)
    };

    return (
        <React.Fragment>
            <div className="search-terminal">
                <input ref={search} type="text" onKeyUp={filter_rows} className="search-bar" />
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
                onSelectedRowsChange={testFunc}
                className="rdg-light"
            />
        </React.Fragment>
    )
};