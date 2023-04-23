import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import { useDispatch , useSelector } from "react-redux";
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

import { uuid } from "../util/Utils";


export const BarcodeScanner = () => {
    const dispatch = useDispatch();
    const [qrCode, setQrCode] = useState();
    const [code, setCode] = useState();

    const config = { fps: 10, qrbox: { width: 300, height: 150 }, 
                     formatsToSupport: [Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.EAN_13], 
                     disableFlip: false,
                };

    const [uuid, setUuid] = useState(null);
    const [error, SetError] = useState(null);

    useEffect(() => {
        const paramsString = window.location.href.split('?')[1];
        const searchParams = new URLSearchParams(paramsString);
        const client_uuid = searchParams.get('q');
        setUuid(client_uuid);
        
        const html5QrCode = new Html5Qrcode("qr-reader");
        setQrCode(html5QrCode);

    }, []);

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText != undefined) {
            console.log(decodedText, decodedResult);
            setCode(decodedText);
            console.log(qrCode);
            qrCode.pause(true);
            // stopScann();
        }
    };

    const qrCodeSErrorCallback = (ErrorMessage) => {
        // console.log(ErrorMessage);  
    };

    const startScann = () => {
        setCode(null);
        qrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeSErrorCallback);
    }

    const stopScann = () => {
        qrCode.stop().then((ignore) => {
            // QR Code scanning is stopped.
            console.log(ignore);
          }).catch((err) => {
            console.log(err);
          });
    }

    return (
       <div>
            <h1>Barcode Scanner {code}</h1>
            {qrCode != undefined && !qrCode.isScanning &&
                <button className="fbutton-inventory fbutton-green" onClick={() => startScann()}>Start Scann</button>
            }
            {code != null &&
                <button className="fbutton-inventory fbutton-green" onClick={() => stopScann()}>Stop </button>
            }
            <div id="qr-reader" className="qr-reader"></div>
        </div>
    )
};