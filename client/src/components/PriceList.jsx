import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor, SelectCellFormatter } from 'react-data-grid';
import { useDispatch , useSelector } from "react-redux";
import { refreshProductListAction, updateProduct } from "../redux/features/product.feature.js";

import 'react-data-grid/lib/styles.css';


export const PriceList = () => {
    const pricing_labels = useSelector((state) => state.product.pricing_labels);
    const pricing = useSelector((state) => state.product.pricing);
    const dispatch = useDispatch();
    const [cellNavigationMode, setCellNavigationMode] = useState('NONE');
    const [rows, setRows] = useState([]);
    const gridRef = useRef(null);

   
    const columns = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'label', name: 'Label', resizable: true, width: 200, editor: textEditor},
            { key: 'price_key', name: 'KEY', editor: textEditor, width: 200 },
            { key: 'date_create', name: 'Date', width: 150 },
            {
                key: 'status', 
                name: 'Status', 
                width: 10, 
                formatter({ row, onRowChange, isCellSelected }) {
                    if(row == undefined) {
                        console.log('undefined row')
                    }
                return (
                  <SelectCellFormatter
                    value={row.status}
                    onChange={() => {
                      onRowChange({ ...row, status: !row.status });
                    }}
                    isCellSelected={isCellSelected}
                  />
                ); },
            }
          ];
    }); 

    

    useEffect(()=> {
        setRows(pricing)
    }, [pricing]);

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
        const args = {
            'field': changes.column.key,
            'value': rows[changes.indexes[0]][changes.column.key],
            'price_id': rows[changes.indexes[0]].id
        };

        console.log(args);

        // dispatch(refreshProductListAction(args));
       
        // dispatch(updateProduct(args))
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
            <DataGrid 
                ref={gridRef}
                columns={columns} 
                rows={rows} 
                onRowsChange={rowChange}
                rowKeyGetter={rowKeyGetter} 
                onCellKeyDown={handleCellKeyDown}
                enableVirtualization={true}
                onCellClick={highlightsrow}
                className={"data-grid-pricelist"}
            />
        </React.Fragment>
    )
};