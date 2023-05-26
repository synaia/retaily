import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios, { AxiosError } from "axios";
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

const solve = (trans) => {
    if (trans instanceof AxiosError) {
        return {
            status: trans.response.status,
            detail: trans.response.data.detail,
            data: undefined
        }
    } else {
        return {
            status: trans.status,
            detail: trans.statusText,
            data: trans.data
        }
    }
}

export const interceptor = createAsyncThunk('interceptor/util', async (args, thunkAPI) => {
    axios.interceptors.request.use(
        async (config) => {
            const T = await getCurrentUser();
            const S = await getPreference('store');
            // console.log(`INTERCEPTOR UPDATE @ ${T.dateupdate} URL(${config.url})`)
            config.headers = {
                'Authorization': `bearer ${T.token}`,
                'store': S.selectedStore,
                'Content-Type': 'application/json'
            }
            return config;
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const e_401 = error?.response?.status;
            const detail = error?.response?.data.detail;
            if (401 == e_401 && detail == "Signature has expired.") {
                console.log(error.message);
                window.location.href = '/#/admin/users/login';
            }
            return error;  // TODO: this was my problem with cath the puto error on auth method.
        }
    );
});

export const auth = createAsyncThunk('users/token', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/token?username=${args.username}&password=${args.password}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solve(resp);
    }).catch( err => {
        return solve(err);
    });
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
            console.log(action.payload)
            const { data } = action.payload
            const { username } = action.meta.arg;
            state.currentUser = data;
            persistUser(data, username);
        }).addCase(auth.rejected, (state, action) => {
            state.loading = false;
            console.log(`Error happen: ${action.error.message}`)
        });
    }
});

export const { changeTheme } = userSlice.actions;
export default userSlice.reducer;
