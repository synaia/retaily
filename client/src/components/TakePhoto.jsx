import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import { useDispatch , useSelector } from "react-redux";

import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";

import axios from "axios";

import 'react-html5-camera-photo/build/css/index.css';
import { uuid } from "../util/Utils";


export const TakePhoto = () => {
    const dispatch = useDispatch();
    
    const [imageURL, SetImageURL] = useState(null);
    const [v_uuid, Set_v_uuid] = useState(null);
    const [error, SetError] = useState(null);

    useEffect(() => {
        const paramsString = window.location.href.split('?')[1];
        const searchParams = new URLSearchParams(paramsString);
        const client_uuid = searchParams.get('q');
        Set_v_uuid(client_uuid);

    }, []);

    
    const removeBackground = (image) => {
        const paramsString = window.location.href.split('?')[1];
        const searchParams = new URLSearchParams(paramsString);
        const client_uuid = searchParams.get('q');
        console.log('client_uuid ', client_uuid);

        const form = new FormData();
        form.append("file", image);
        form.append("client_uuid", client_uuid);
      
        const options = {
            method: 'POST',
            url: `https://10.0.0.6:8500/products/uploadfile/${client_uuid}`,
            headers: {
                'Content-Type': 'multipart/form-data;',
            },
            data: form,
        };

        axios.request(options).then(function (response) {
            // const url =  `data:image/png;base64,${response.data}`;
            // SetImageURL(url);
            const data = response.data;
            if (data.code == "fail") {
                SetError(data.message);
            }
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


    return (
        <React.Fragment>
            { v_uuid != null &&
                <div className="infoTakePhoto">
                    <h3>{v_uuid}</h3>
                </div>
            }
            { error != null &&
                <div className="errorTakePhoto">
                    <h1>{error}</h1>
                </div>
            }
                <Camera 
                    onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                    imageType = {IMAGE_TYPES.PNG}
                    idealFacingMode = {FACING_MODES.ENVIRONMENT}
                    isFullscreen={true}
                />
        </React.Fragment>
    )
};