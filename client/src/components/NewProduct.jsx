import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import { useDispatch , useSelector } from "react-redux";
import axios from "axios";
import QRCode from "qrcode";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";

import { refreshProductListAction, addProduct } from "../redux/features/product.feature.js";
import { uuid } from "../util/Utils.js";
import { BACKEND_HOST, BACKEND_HOST_WWS, SELF_HOST } from "../util/constants.js";


import 'react-html5-camera-photo/build/css/index.css';
import { Inventory } from "./Inventory.jsx";

import { lang } from "../common/spa.lang.js";


export const NewProduct = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const pricing = useSelector((state) => state.product.pricing);
    const stores = useSelector((state) => state.product.stores);
    const loading = useSelector((state) => state.product.loading);
    const errorMessage = useSelector((state) => state.product.errorMessage);
    const [errorLabel, SetErrorLabel] = useState(null);
    const [errorPriceKey, SetErrorPriceKey] = useState(null);
    const [errorPercent, SetErrorPercent] = useState(null);
    const dispatch = useDispatch();

    const [image, SetImage] = useState(null);
    const [v_uuid, Set_v_uuid] = useState(null);
    const [imageURL, SetImageURL] = useState(null);

    const product_name = useRef();
    const product_cost = useRef();
    const product_code = useRef();

    const storesRef =  [];
    stores.forEach( (st) => {
        storesRef[st.id] = React.createRef();
    });

    const pricingRef =  [];
    pricing.forEach( (p) => {
        pricingRef[p.id] = React.createRef();
    });

    const __addProduct = () => {
        const inventory = [];
        stores.forEach( (st) => {
            let inv = {
                quantity: storesRef[st.id].current?.value,
                store: st
            }
            inventory.push(inv);
        });

        const pricinglist = [];
        pricing.forEach((p) => {
            let price = {
                pricing_id: p.id,
                price: pricingRef[p.id].current?.value,
                user_modified: currentUser.username
            };
            pricinglist.push(price);
        });

        const product = {
            name: product_name.current?.value,
            cost: product_cost.current?.value,
            code: product_code.current?.value,
            user_modified: currentUser.username,
            img_path: v_uuid,
            inventory: inventory,
            pricinglist: pricinglist
        };
        

        // console.log(product);
        dispatch(addProduct(product))
    };

    // FIX : weak func because asumMe # 1 as default price INPUT.
    useEffect(() => {
        const pricetag = document.querySelector('.pricing');
        if (pricetag != undefined && pricingRef[1].current != undefined) {
            pricetag.addEventListener("keyup", (event) => {
                pricing.forEach((p) => {
                    if (pricingRef[p.id].current != undefined) {
                        const val = pricingRef[1].current.value;
                        if (p.id != 1) {
                            pricingRef[p.id].current.value = val;
                        }
                    }
                });
            });
        }
    }, [pricing, pricingRef]);

    useEffect(() => {
        console.log(imageURL);
    }, [imageURL]);

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


    const removeBackground = (image) => {
        const form = new FormData();
        form.append("file", image);
        // form.append("client_uuid", v_uuid);
      
        const options = {
            method: 'POST',
            url: `${BACKEND_HOST}/products/uploadfilelocal/${v_uuid}`,
            headers: {
                'Content-Type': 'multipart/form-data;',
            },
            data: form,
        };

        axios.request(options).then(function (response) {
            const url =  `data:image/png;base64,${response.data}`;
            SetImageURL(url);
        }).catch(function (error) {
            console.error(error);
        });
    };


    const dataURLtoFile = (dataurl, filename) => {
        const   arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = window.atob(arr[1]);
                

        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    const fireImage = async (event) => {
        const image = event.target.files[0];
        removeBackground(image);
    };

    const handleTakePhotoAnimationDone = (dataUri) => {
        const image = dataURLtoFile(dataUri);
        removeBackground(image);
    };

    useEffect(() => {
        const client_uuid = uuid();
        Set_v_uuid(client_uuid);
        try {
            var ws = new WebSocket(`${BACKEND_HOST_WWS}/products/ws/${client_uuid}`);
            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.sharable != undefined) {
                    const url =  `data:image/png;base64,${data.sharable.image_base64}`;
                    SetImageURL(url);
                } else {
                    console.log(data);
                }
            };
        } catch (err) {
            console.log(err);
        }
        
    }, []);

    const generateQR = async (__uuid) => {
        const url = `${SELF_HOST}/#/admin/inventory/takephoto?q=${__uuid}`;
        console.log(url);
        Set_v_uuid(__uuid);
        try {
          const u = await QRCode.toDataURL(url);
          SetImageURL(u);
        } catch (err) {
          console.error(err)
        }
    };
   

    return (
        <React.Fragment>
            {!loading && errorMessage &&  <div className="danger">{errorMessage} </div>}

            <div className="product-field">
                <div>
                    <input type="text" className="text" placeholder={lang.products.name}  ref={product_name} onKeyUp={() => SetErrorLabel(null)} />
                </div>

                <div className="foto-area">
                    {v_uuid != null && <span>{v_uuid}</span>}
                    {
                        (imageURL != null)
                        && <img className="new-product-pic" src={imageURL} />
                        // <Camera 
                        //     onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                        //     imageType = {IMAGE_TYPES.PNG}
                        //     idealFacingMode = {FACING_MODES.ENVIRONMENT}
                        // />
                    }
                </div> 

                <div>
                    <input type="number" className="text" placeholder={lang.products.cost}  ref={product_cost} onKeyUp={() => SetErrorPriceKey(null)} />
                </div>            
                <div>
                    <input type="text" className="text" placeholder={lang.newproduct.code}  ref={product_code} onKeyUp={() => SetErrorPercent(null)} />
                </div>

                <div className="new-product-sub">
                    <span >
                        {lang.menu.storelist}
                    </span>
                </div>
                
                { stores.map((st, i) => (
                    <React.Fragment key={i}>
                        <div>
                            <input type="number" className="text" placeholder={st.name}  ref={storesRef[st.id]} onKeyUp={() => SetErrorPriceKey(null)} />
                            <span className="error-msg">{errorPriceKey}</span>
                        </div>
                    </React.Fragment>
                    ))
                }

                <div className="new-product-sub">
                    <span >
                        {lang.menu.pricelist}
                    </span>
                </div>

                { pricing.map((pr, i) => (
                    <React.Fragment key={i}>
                    <div>
                        <input type="number" className="text" placeholder={pr.label}  ref={pricingRef[pr.id]}  />
                        <span className="error-msg">{errorPriceKey}</span>
                    </div>
                    </React.Fragment>
                    ))
                }


               
                <div className="new-product-but">
                    <button className="fbutton fbutton-price-list" onClick={() => __addProduct()}>
                        <span className="material-icons-sharp"> rocket_launch </span>
                        <span>{lang.newproduct.create}</span>
                    </button>
                    <div></div>
                    <input type="file"  accept="image/png, image/jpg" onChange={fireImage} className="fbutton" />

                    {/* <button className="fbutton fbutton-price-list" onClick={() => SetImageURL(null)}>
                        <span className="material-icons-sharp"> add_a_photo </span>
                        <span>{lang.newproduct.take}</span>
                    </button> */}

                    <button className="fbutton fbutton-price-list" onClick={() => generateQR(v_uuid)}>
                         <span className="material-icons-sharp"> settings_remote </span>
                        <span>{lang.newproduct.connect}</span>
                    </button>

                </div>
            </div>
        </React.Fragment>
    )
};