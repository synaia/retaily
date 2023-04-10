export const F_ = (number_value) => {
    number_value = (number_value == undefined) ? 0 : number_value;
    const n = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(number_value.toFixed(2));
    return n;
};

export const N_ = (number_value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
}).format(number_value.toFixed(2))


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