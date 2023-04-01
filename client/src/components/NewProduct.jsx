import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import DataGrid from 'react-data-grid';
import {SelectColumn, textEditor, SelectCellFormatter } from 'react-data-grid';
import { useDispatch , useSelector } from "react-redux";
import { refreshProductListAction, updateProduct, addPricing, getPricing, updatePricing } from "../redux/features/product.feature.js";
import axios from "axios";
import 'react-data-grid/lib/styles.css';


export const NewProduct = () => {
    const pricing = useSelector((state) => state.product.pricing);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const [errorLabel, SetErrorLabel] = useState(null);
    const [errorPriceKey, SetErrorPriceKey] = useState(null);
    const [errorPercent, SetErrorPercent] = useState(null);
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const gridRef = useRef(null);

    const [image, SetImage] = useState(null);
    const [imageURL, SetImageURL] = useState(null);

    const label = useRef();
    const price_key = useRef();
    const percent = useRef();

    const cleanInput = () => {
        label.current.value = '';
        price_key.current.value = '';
        percent.current.value = '';
    };

    const validateInput = (element, type) => {
        if (element == undefined) {
            return {'return': false, 'msg': 'Is undefined.'};
        }
        if (type === "number") {
            if (!isNaN(parseFloat(element))) {
                return {'return': true, 'msg': ''};
            } else {
                return {'return': false, 'msg': 'Incorrect number.'};
            }
        }
        if (type === "str") {
            const val = element == null || element.match(/^ *$/) !== null;
            return {'return': !val, 'msg': 'Evaluation of string fail'};
        }
        return  {'return': false, 'msg': 'Wtf.'};
    };

    const __addPricing = () => {
        SetErrorLabel(null);
        SetErrorPriceKey(null);
        SetErrorPercent(null);
        let val = validateInput(label.current?.value, "str");
        if (!val.return) {
            SetErrorLabel(`${val.msg}`);
            return;
        }
        val = validateInput(price_key.current?.value, "str");
        if (!val.return) {
            SetErrorPriceKey(`${val.msg}`);
            return;
        }
        val = validateInput(percent.current?.value, "number");
        if (!val.return) {
            SetErrorPercent(`${val.msg}`);
            return;
        }

        const pricing = {
            'label': label.current?.value,
            'price_key': price_key.current?.value,
            'user_modified': 'user_dummy'
        };

        const args = {
            'percent': percent.current?.value,
            'pricing': pricing
        };

        dispatch(addPricing(args));

        cleanInput();
    };

   
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
        setRows(pricing);
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



    // useEffect(() => {
    //     if (image == null || image == undefined) return;
    //     const url = URL.createObjectURL(image);
    //     SetImageURL(url);
    //     console.log('Image is Not Null')

        

    // }, [image]);

    function readBuffer(file) {
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                resolve(reader.result);
            }
            ;
            reader.onerror = reject;
            // reader.readAsArrayBuffer(file);
            // reader.readAsBinaryString(file);
            reader.readAsText(file);
        }
        );
    }



    const fireImage = async (event) => {
        const image = event.target.files[0];

    
        // SetImage(image);
        // console.log('image ', image);


        const form = new FormData();
        form.append("file", image);
      
        const options = {
            method: 'POST',
            url: 'https://localhost:8500/products/uploadfile',
            headers: {
                'Content-Type': 'multipart/form-data;',
            },
            data: form,
        };

        axios.request(options).then(function (response) {
            // console.log(response.data);
            // const arrayBufferView = new Uint8Array( response.data );
            // const blobImage = new Blob( [ arrayBufferView ], { type: "image/png" } );
            // const url = URL.createObjectURL(blobImage);
            const url =  `data:image/png;base64,${response.data}`;
            SetImageURL(url);
        }).catch(function (error) {
            console.error(error);
        });
    };

    return (
        <React.Fragment>
            {!loading && errorMessage &&  <div className="danger">{errorMessage} </div>}
            <div className="new-product">
                <div className="new-product-p">
                    <div>
                        <span>Name</span>
                        <div className="price-list-b">
                            <span className="material-icons-sharp price-list-i"> edit_note </span>
                            <input type="text" className="price-list-t" ref={label} onKeyUp={() => SetErrorLabel(null)} />
                            <span className="underline-animation"></span>
                        </div>
                        <span className="error-msg">{errorLabel}</span>
                    </div>
                    <div>
                        <span>Cost</span>
                        <div className="price-list-b">
                            <span className="material-icons-sharp price-list-i"> vpn_key </span>
                            <input type="text" className="price-list-t" ref={price_key} onKeyUp={() => SetErrorPriceKey(null)} />
                            <span className="underline-animation"></span>
                        </div>
                        <span className="error-msg">{errorPriceKey}</span>
                    </div>
                    <div>
                        <span>SKU (code)</span>
                        <div className="price-list-b">
                            <span className="material-icons-sharp price-list-i"> percent </span>
                            <input type="number" className="price-list-t" ref={percent}  onKeyUp={() => SetErrorPercent(null)} />
                            <span className="underline-animation"></span>
                        </div>
                        <span className="error-msg">{errorPercent}</span>
                    </div>
                </div>

                <div className="new-product-x">
                    <div>
                        <h3 className="new-product-st">Inventory</h3>
                        <div className="new-product-i">
                            <div>
                                <span>Store</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> edit_note </span>
                                    <input readOnly type="text" className="price-list-t" ref={label} onKeyUp={() => SetErrorLabel(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorLabel}</span>
                            </div>
                            <div>
                                <span>Quantity</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> vpn_key </span>
                                    <input type="text" className="price-list-t" ref={price_key} onKeyUp={() => SetErrorPriceKey(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorPriceKey}</span>
                            </div>
                        </div>

                        <h3 className="new-product-st">Pricing</h3>
                        <div className="new-product-i">
                            <div>
                                <span>Label</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> edit_note </span>
                                    <input readOnly type="text" className="price-list-t" ref={label} onKeyUp={() => SetErrorLabel(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorLabel}</span>
                            </div>
                            <div>
                                <span>Price</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> vpn_key </span>
                                    <input type="text" className="price-list-t" ref={price_key} onKeyUp={() => SetErrorPriceKey(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorPriceKey}</span>
                            </div>
                            <div>
                                <span>Label</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> edit_note </span>
                                    <input readOnly type="text" className="price-list-t" ref={label} onKeyUp={() => SetErrorLabel(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorLabel}</span>
                            </div>
                            <div>
                                <span>Price</span>
                                <div className="price-list-b">
                                    <span className="material-icons-sharp price-list-i"> vpn_key </span>
                                    <input type="text" className="price-list-t" ref={price_key} onKeyUp={() => SetErrorPriceKey(null)} />
                                    <span className="underline-animation"></span>
                                </div>
                                <span className="error-msg">{errorPriceKey}</span>
                            </div>
                        </div>
                    </div>
                    <div className="new-product-img">
                        <input type="file"  accept="image/*" onChange={fireImage} />
                        {imageURL != null && 
                            <img src={imageURL} />
                        }
                    </div>
                </div>

                <div>
                    <button className="fbutton fbutton-price-list" >
                        <span className="material-icons-sharp"> rocket_launch </span>
                        <span>CREATE PRICE LIST</span>
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
};