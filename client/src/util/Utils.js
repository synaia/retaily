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