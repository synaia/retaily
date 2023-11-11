import Axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_HOST } from "../../util/constants";

const initialState = {
    loading: false,
    clients: [],
    errorMessage: {
        errors: [],
        notify: false,
    },
};

export const loadClients = createAsyncThunk('clients/loadClients', async () => {
    console.log('loadClients .... ');
    let response = await Axios.get(`${BACKEND_HOST}/clients/`, {});
    return response.data;
});

export const addClient = createAsyncThunk('clients/addClient', async (client,) => {
    let response = await Axios.post(`${BACKEND_HOST}/clients/add`, client, {});
});

export const updateClient = createAsyncThunk('clients/updateClient', async (args, ) => {
    let response = await Axios.post(`${BACKEND_HOST}/clients/update`, args,  {
        params: {
            client_id: args.client_id,
            field: args.field,
            value: args.value,
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

const refreshClientList = (state, action) => {
    const {field, value, client_id} = action.payload;
    const _clients = [...state.clients];
    const index = _clients.findIndex(c => c.id == client_id);
    _clients[index][field] = value;
    state.clients = _clients;
}

const clientsSlice = createSlice({
    name: 'clients',
    initialState: initialState,
    reducers: {
        putClientinListAction: putClientinList,
        updateClientinListAction: updateClientinList,
        refreshClientListAction: refreshClientList,
        setErrViewedClient: (state, action) => {
            state.errorMessage.notify = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadClients.pending, (state, action) => {
            state.loading = true
        }).addCase(loadClients.fulfilled, (state, action) => {
            state.loading = false
            state.clients = action.payload
        }).addCase(loadClients.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR loadClients; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(addClient.pending, (state, action) => {
            state.loading = true
        }).addCase(addClient.fulfilled, (state, action) => {
            state.loading = false;
        }).addCase(addClient.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR addClient; ${action.error.message}`);
            state.errorMessage.notify = false;
        });

        builder.addCase(updateClient.pending, (state, action) => {
            state.loading = true
        }).addCase(updateClient.fulfilled, (state, action) => {
            state.loading = false;
        }).addCase(updateClient.rejected, (state, action) => {
            state.loading = false
            state.errorMessage.errors.push(`ERROR updateClient; ${action.error.message}`);
            state.errorMessage.notify = false;
        });
    }
});

export const { putClientinListAction, updateClientinListAction, setErrViewedClient, refreshClientListAction } = clientsSlice.actions;
export default clientsSlice.reducer;
