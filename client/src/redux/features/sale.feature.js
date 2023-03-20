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
            invoice_status: data_range.invoice_status
        },
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });

    return response.data;
});


const salesSlice = createSlice({
    name: 'sales',
    initialState: initialState,
    extraReducers: (builder) => {
        builder.addCase(loadSales.pending, (state, action) => {
            state.loading = true
        }).addCase(loadSales.fulfilled, (state, action) => {
            state.loading = false
            state.sales = action.payload
        }).addCase(loadSales.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadSales; ${action.error.message}`
        })
    }
});


export default salesSlice.reducer;