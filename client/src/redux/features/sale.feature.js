import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOKEN, STORE, BACKEND_HOST } from "../../util/constants";

const initialState = {
    loading: false,
    sales: [],
    errorMessage: null
};

export const loadSales = createAsyncThunk('products/loadSales', async (data_range) => {
    console.log('loadSales...');
    let response = await Axios.get(`${BACKEND_HOST}/sales/`, {
        params: {
            init_date: data_range.init_date,
            end_date: data_range.end_date,
            invoice_status: data_range.invoice_status,
            client_id: data_range.client_id
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});


export const addPay = createAsyncThunk('sale/add_pay', async (data_request) => {
    // console.log(data_request);
    let response = await Axios.put(`${BACKEND_HOST}/sales/add_pay`, data_request.paids, {
        params: {
            sale_id: data_request.sale_id,
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
});

const updatePayInList = (state, action, payload) => {
    const { sale_id, paids } = payload;
    const index = state.sales.findIndex(s => s.id == sale_id);
    const copy_sales = [...state.sales];
    console.log(copy_sales[index].sale_paid);
    copy_sales[index].sale_paid = paids;
    state.sales = copy_sales;
    // console.log(action.payload);
    // console.log(state.sales[index].sale_paid)
    // state.sales[index].sale_paid = [paids, ...state.sales[index].sale_paid];
    
};

const salesSlice = createSlice({
    name: 'sales',
    initialState: initialState,
    reducers: {
        updatePayInListAction: updatePayInList,
    },
    extraReducers: (builder) => {
        builder.addCase(loadSales.pending, (state, action) => {
            state.loading = true
        }).addCase(loadSales.fulfilled, (state, action) => {
            state.loading = false
            state.sales = action.payload
        }).addCase(loadSales.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadSales; ${action.error.message}`
        });

        builder.addCase(addPay.pending, (state, action) => {
            // Pending....
        }).addCase(addPay.fulfilled, (state, action) => {
           const { sale_id, paids } = action.payload;
           updatePayInList(state, action, action.payload);
        }).addCase(addPay.rejected, (state, action) => {
            state.errorMessage = `ERROR loadSales; ${action.error.message}`
        });
    }
});


export const {updatePayInListAction} = salesSlice.actions;
export default salesSlice.reducer;