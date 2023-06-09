import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import DataGrid from 'react-data-grid';
import { useDispatch , useSelector } from "react-redux";
import { addBulkOrder } from "../redux/features/product.feature.js";
import { validateInput } from "../util/Utils.js";

import 'react-data-grid/lib/styles.css';


export const BulkLabelList = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const bulk_labels = useSelector((state) => state.product.bulk_labels);
    const loading = useSelector((state) => state.product.loading);
    const theme = useSelector((state) => state.user.theme);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const [errorName, SetErrorName] = useState(null);
    const [errorMemo, SetErrorMemo] = useState(null);
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const gridRef = useRef(null);

    const name = useRef();
    const memo = useRef();

    const cleanInput = () => {
        name.current.value = '';
        memo.current.value = '';
    };

    const __addBulkOrder = () => {
        SetErrorName(null);
        SetErrorMemo(null);
        let val = validateInput(name.current?.value, "str");
        if (!val.return) {
            SetErrorName(`${val.msg}`);
            return;
        }
        val = validateInput(memo.current?.value, "str");
        if (!val.return) {
            SetErrorMemo(`${val.msg}`);
            return;
        }

        const args = {
            'name': name.current?.value,
            'memo': memo.current?.value,
            'user_create': currentUser.username
        };

        dispatch(addBulkOrder(args));
        // console.log(args)

        cleanInput();
    };

   
    const columns = useMemo( () => {
        return [
            { key: 'id', name: 'ID', width: 10 },
            { key: 'name', name: 'Name', resizable: true, width: 200 },
            { key: 'memo', name: 'Memo', resizable: true, width: 250 },
            { key: 'date_create', name: 'Date', width: 150 },
            { key: 'user_create', name: 'User', width: 100 },
          ];
    }); 

    

    useEffect(()=> {
        setRows(bulk_labels);
    }, [bulk_labels]);

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


    return (
        <React.Fragment>
            {!loading && errorMessage &&  <div className="danger">{errorMessage} </div>}
            <div className="price-list">
                <div>
                    <span>Name</span>
                    <div className="price-list-b">
                        <span className="material-icons-sharp price-list-i"> edit_note </span>
                        <input type="text" className="price-list-t" ref={name} onKeyUp={() => SetErrorName(null)} />
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorName}</span>
                </div>
                <div>
                    <span>Memo</span>
                    <div className="price-list-b">
                        <input type="text" className="price-list-t" ref={memo} onKeyUp={() => SetErrorMemo(null)} />
                        <span className="underline-animation"></span>
                    </div>
                    <span className="error-msg">{errorMemo}</span>
                </div>
                <div>
                <button className="fbutton fbutton-price-list" onClick={() => __addBulkOrder()}>
                    <span className="material-icons-sharp"> rocket_launch </span>
                    <span>CREATE BULK </span>
                </button>
                </div>
            </div>
            <DataGrid 
                ref={gridRef}
                columns={columns} 
                rows={rows} 
                rowKeyGetter={rowKeyGetter} 
                enableVirtualization={true}
                onCellClick={highlightsrow}
                className={`data-grid-pricelist ${theme.grid_theme}`}
            />
        </React.Fragment>
    )
};