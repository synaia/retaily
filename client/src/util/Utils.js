import Axios, { AxiosError } from "axios";
import store from "../redux/store.js";

export const F_ = (number_value) => {
    number_value = (number_value == undefined) ? 0 : number_value;
    const n = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(number_value.toFixed(2));
    return n;
};

export const T_ = (number_value) => {
    number_value = (number_value == undefined) ? 0 : number_value;
    const n = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(number_value.toFixed(0));
    return n;
};

export const R_ = (number_value) => {
    number_value = (number_value == undefined) ? 0 : number_value;
    return Math.round((number_value + Number.EPSILON) * 100) / 100;
};



export const uuid = () => { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// TODO: keep ONE function
export const validateInput = (element, type) => {
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

// TODO: keep ONE function :-)
export const validateInputX = (element, type, SetFunc) => {
    const valix = (elementval, type) => {
        if (elementval == undefined) {
            return {'return': false, 'msg': 'Is undefined.'};
        }
        if (type === "number") {
            if (!isNaN(parseFloat(elementval))) {
                return {'return': true, 'msg': ''};
            } else {
                return {'return': false, 'msg': 'Incorrect number.'};
            }
        }
        if (type === "str") {
            const val = elementval == null || elementval.match(/^ *$/) !== null;
            return {'return': !val, 'msg': val ? 'Evaluation of string fail' : 'Okay'};
        }
        return  {'return': false, 'msg': 'Wtf.'};
    };
    const res = valix(element.current?.value, type);
    console.log(res);
    SetFunc(null);
    if (!res.return) {
        SetFunc(res.msg);
        return false;
    }
    return true;
};


export const beauty = (whats) => {
    return JSON.parse(JSON.stringify(whats))
}



/**
 * Helper function to emit a beep sound in the browser using the Web Audio API.
 * 
 * @param {number} duration - The duration of the beep sound in milliseconds.
 * @param {number} frequency - The frequency of the beep sound.
 * @param {number} volume - The volume of the beep sound.
 * 
 * @returns {Promise} - A promise that resolves when the beep sound is finished.
 */
export const  beep = (duration, frequency, volume) => {
    const myAudioContext = new AudioContext();
    return new Promise((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try{
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type= "square";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}

export const Azzed = () => {
    console.log(store)
    axios.interceptors.request.use(config => {
        // config.headers = {
        //     'Authorization': `bearer ${TOKEN}`,
        //     'store': STORE
        // }
        // console.log('axios.interceptors.request', config)
        return config;
    });
}


export const solveResponse = (trans) => {
    if (trans instanceof AxiosError) {
        if (trans.code != null && AxiosError.ERR_NETWORK == trans.code) {
            return {
                status: 502,
                detail: trans.message,
                data: undefined
            }
        }
        return {
            status: trans.response.status,
            detail: trans.response.data.detail,
            data: undefined
        }
    }

    if (Axios.isCancel(trans)) {
        return {
            status: 504,
            detail: trans.message,
            data: undefined
        }
    }

    return {
        status: trans.status,
        detail: trans.statusText,
        data: trans.data
    }
}