import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOKEN, STORE, BACKEND_HOST } from "../../util/constants";
import { storeInfo } from "../../common/store-info";

const initialState = {
    loading: false,
    clients: [],
    errorMessage: null
};

export const loadClients = createAsyncThunk('clients/loadClients', async () => {
    console.log('loadClients .... ');
    let response = await Axios.get(`${BACKEND_HOST}/clients/`, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE
        }
    });
    return response.data;
});

export const addClient = createAsyncThunk('clients/addClient', async (client,) => {
    let response = await Axios.post(`${BACKEND_HOST}/clients/add`, client, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
});

export const updateClient = createAsyncThunk('clients/updateClient', async (client, ) => {
    let response = await Axios.put(`${BACKEND_HOST}/clients/update/${client.id}`, client, {
        headers: {
            'Authorization': `bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        }
    });
});

const putClientinList = (state, action) => {
    const client = action.payload;
    state.clients = [client, ...state.clients];
};

const updateClientinList = (state, action) => {
    const client = action.payload;
    let index = state.clients.findIndex(c => c.id == client.id);
    const copy_clients = [...state.clients];
    copy_clients[index] = client;
    state.clients = copy_clients;
};

const clientsSlice = createSlice({
    name: 'clients',
    initialState: initialState,
    reducers: {
        putClientinListAction: putClientinList,
        updateClientinListAction: updateClientinList,
    },
    extraReducers: (builder) => {
        builder.addCase(loadClients.pending, (state, action) => {
            state.loading = true
        }).addCase(loadClients.fulfilled, (state, action) => {
            state.loading = false
            state.clients = action.payload
        }).addCase(loadClients.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR loadClients; ${action.error.message}`
        });

        builder.addCase(addClient.pending, (state, action) => {
            state.loading = true
        }).addCase(addClient.fulfilled, (state, action) => {
            state.loading = false;
            
        }).addCase(addClient.rejected, (state, action) => {
            state.loading = false
            state.errorMessage = `ERROR addClient; ${action.error.message}`
        });
    }
});

export const { putClientinListAction, updateClientinListAction } = clientsSlice.actions;
export default clientsSlice.reducer;
