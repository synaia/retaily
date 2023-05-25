import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import axios from "axios";


import { persistUser, getCurrentUser, getPreference } from "../../api/db";
import { BACKEND_HOST } from "../../util/constants";

const current = await getCurrentUser();
const pref = await getPreference('store');

const initialState = {
    currentUser: current,
    preferences: {
        selectedStore: pref?.value
    },
    theme: {
        ui_theme: 'dark-theme-variables"',
        grid_theme: 'rdg-dark',
        dark_theme_base: 'dark-theme-variables',
    }
};

export const interceptor = createAsyncThunk('interceptor/util', async (args, thunkAPI) => {
    const state = thunkAPI.getState();
    const TOKEN  = state.user.currentUser.token;
    const STORE  = state.user.preferences.selectedStore;
    axios.interceptors.request.use(config => {
        config.headers = {
            'Authorization': `bearer ${TOKEN}`,
            'store': STORE,
            'Content-Type': 'application/json'
        }
        return config;
    });
});

export const auth = createAsyncThunk('users/token', async (args) => {
    let response = await Axios.post(
        `${BACKEND_HOST}/users/token?username=${args.username}&password=${args.password}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
});


const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        changeTheme: (state, action) => {
            console.log('change theme')
            const dtvars = (state.theme.ui_theme == undefined) ? "dark-theme-variables" : undefined;
            const rdg = (state.theme.grid_theme == undefined) ? "rdg-dark" : undefined;
            state.theme =  {
                ui_theme: dtvars,
                grid_theme: rdg,
                dark_theme_base: 'dark-theme-variables',
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(auth.pending, (state, action) => {
            state.loading = true;
        }).addCase(auth.fulfilled, (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            const { username } = action.meta.arg;
            persistUser(action.payload, username);
        }).addCase(auth.rejected, (state, action) => {
            state.loading = false;
            console.log(`Error happen: ${action.error.message}`)
        });
    }
});

export const { changeTheme } = userSlice.actions;
export default userSlice.reducer;
