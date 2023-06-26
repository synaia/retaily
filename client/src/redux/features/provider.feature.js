import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_HOST } from "../../util/constants";


const initialState = {
    providers: [],
    loading: false,
    errorMessage: {
        errors: [],
        notify: false,
    },
};

export const loadProviders = createAsyncThunk('provider', async () => {
    console.log('provider .... ');
    let response = await Axios.get(`${BACKEND_HOST}/provider/`, {});
    return response.data;
});


const providerSlice = createSlice({
    name: 'clients',
    initialState: initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder.addCase(loadProviders.pending, (state, action) => {
            state.loading = true
        }).addCase(loadProviders.fulfilled, (state, action) => {
            state.loading = false
            state.providers = action.payload
        }).addCase(loadProviders.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR loading provider; ${action.error.message}`);
            state.errorMessage.notify = false;
        });
    }
});

// export const { putClientinListAction, updateClientinListAction } = clientsSlice.actions;
export default providerSlice.reducer;
