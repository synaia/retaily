import React from "react";
import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor, SelectCellFormatter } from 'react-data-grid';

import { F_, validateInputX } from "../util/Utils";
import { addProductOrder } from "../redux/features/product.feature.js";


export const StoreMovementList = () => {
    const navigator = useNavigate();
    const params = useParams();
    const order_id = 1;
    const order_type = 'internal';

    const orders = useSelector((state) => state.product.orders);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const [errorMemo, SetErrorMemo] = useState(null);
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const gridRef = useRef(null);

    const memo = useRef();

    const cleanInput = () => {
        memo.current.value = '';
    };

    const __addProductOrder = () => {
        if (!validateInputX(memo, "str", SetErrorMemo)) {
            return;
        }

        const order = {
            "name": `MOV-${params.store_name}-${(new Date()).toISOString().substring(0, 10)}`,
            "memo": memo.current?.value,
            "order_type": order_type,
            "user_requester": "userloged"
          }

        dispatch(addProductOrder(order));

        cleanInput();
    };

   
    const columns = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'from_store', name: 'From Store', width: 50 },
            { key: 'to_store', name: 'To Store', width: 50 },
            { key: 'name', name: 'Mov Code', resizable: true, width: 200 },
            { key: 'memo', name: 'Memo',  width: 300 },
            { key: 'date_opened', name: 'Date', width: 150 },
            { key: 'date_closed', name: 'Date', width: 150 },
            { key: 'status', name: 'Order Status' },
            { key: 'lines', name: 'Qty' },
            { key: 'issue_lines', name: 'Issue Qty' }
          ];
    }); 

    const get_rows = (_list_) => {
        console.log('call get_rows')
        const _rows_ = [];
        _list_.forEach(ls => {
            const row = {
                'id': ls.id,
                'from_store': ls.from_store.name,
                'to_store': ls.to_store.name,
                'name': ls.name,
                'memo': ls.memo,
                'status': ls.status,
                'date_opened': ls.date_opened,
                'date_closed': ls.date_closed,
                'lines': ls.products_in_order,
                'issue_lines': ls.products_in_order_issue,
            };
            _rows_.push(row)
        });
        return _rows_;
    };

    

    useEffect(()=> {
        setRows(get_rows(orders));
    }, [orders]);

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
       
        dispatch(updatePricing(args))
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


    return (
        <React.Fragment>
            {!loading && errorMessage &&  <div className="danger">{errorMessage} </div>}
            <div className="price-list">
                <div>
                    <span>Memo</span>
                    <div className="price-list-b">
                        <span className="material-icons-sharp price-list-i"> edit_note </span>
                        <input type="text" className="price-list-t" ref={memo} onKeyUp={() => SetErrorMemo(null)} />
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorMemo}</span>
                </div>
                <div>
                <button className="fbutton fbutton-price-list" onClick={() => __addProductOrder()}>
                    <span className="material-icons-sharp"> rocket_launch </span>
                    <span>OPEN NEW MOVEMENT</span>
                </button>
                </div>
            </div>
            <DataGrid 
                ref={gridRef}
                columns={columns} 
                rows={rows} 
                onRowsChange={rowChange}
                rowKeyGetter={rowKeyGetter} 
                enableVirtualization={true}
                onCellClick={highlightsrow}
                className={"data-grid-pricelist rdg-dark"}
            />
        </React.Fragment>
    )
};