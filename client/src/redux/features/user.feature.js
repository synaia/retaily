import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios, { AxiosError } from "axios";
import axios from "axios";


import { persistUser, getCurrentUser, getPreferences, persistPreference } from "../../api/db";
import { BACKEND_HOST } from "../../util/constants";
import { beauty } from "../../util/Utils";

const LOGIN = '/#/admin/users/login';

let current = await getCurrentUser('url:user.feature.js');
if (current)
    current.dateupdate = current.dateupdate.toISOString();
else 
    window.location.href = LOGIN;

const { store, ui_theme, grid_theme } = await getPreferences();

const initialState = {
    loading: false,
    errorMessage: null,
    currentUser: current,
    preferences: {
        selectedStore: store
    },
    theme: {
        'ui_theme': ui_theme,
        'grid_theme': grid_theme,
        dark_theme_base: 'dark-theme-variables',
    }
};

const solve = (trans) => {
    if (trans instanceof AxiosError) {
        if (trans.code != null && AxiosError.ERR_NETWORK == trans.code) {
            return {
                status: 502,
                detail: trans.message,
                user: undefined
            }
        }
        return {
            status: trans.response.status,
            detail: trans.response.data.detail,
            user: undefined
        }
    }

    return {
        status: trans.status,
        detail: trans.statusText,
        user: trans.data
    }
}

export const interceptor = createAsyncThunk('interceptor/util', async (args, thunkAPI) => {
    axios.interceptors.request.clear();

    axios.interceptors.request.use(
        async (config) => {
            if (config.url.includes('/users/token')) {
                return config;
            }
            const U = await getCurrentUser(config.url);
            config.headers = {
                'Authorization': `bearer ${U.token}`,
                'store': U.selectedStore,
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
                window.location.href = LOGIN;
                console.log(detail)
            }
            return Promise.reject(error);
            // return error;  // TODO: this was my problem with cath the puto error on auth method.
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
        args.loggeSucess(true);
        return solve(resp);
    }).catch( err => {
        args.loggeSucess(false);
        return solve(err);
    });
});

export const logout = createAsyncThunk('users/logout', async (args) => {
    // const T = await getCurrentUser('users/logout');
    // T.token = undefined;
    // T.selectedStore = undefined;
    // persistUser(T);
    // window.location.href = LOGIN;

    return await Axios.post(
        `${BACKEND_HOST}/users/logout`, {
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

            persistPreference('ui_theme', dtvars);
            persistPreference('grid_theme', rdg);
        },
        changeStore: (state, action) => {
            state.currentUser.selectedStore = action.payload; 
            persistUser(beauty(state.currentUser));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(auth.pending, (state, action) => {
            state.loading = true;
        }).addCase(auth.fulfilled, (state, action) => {
            state.loading = false;
            const { user, status, detail } = action.payload
            if (status >= 200 && status <= 300) {
                if (user?.stores.length > 0) {
                    const store_default = (user?.stores.length == 1) ? user?.stores[0] : undefined;
                    user.selectedStore = store_default;
                  }
                persistUser(user);
                state.currentUser = user;
                // dateupdate.toISOString();
                state.errorMessage = '';
            } else {
                state.errorMessage = detail;
            }
        }).addCase(auth.rejected, (state, action) => {
            state.loading = false;
            console.log(`Error happen: ${action.error.message}`)
            state.errorMessage = action.error.message;
        });

        builder.addCase(logout.pending, (state, action) => {
            state.loading = true;
        }).addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            const { user, status, detail } = action.payload
            user.is_logout = true;
            persistUser(user);
            state.currentUser = user; // expired token - user
            state.errorMessage = '';
        }).addCase(logout.rejected, (state, action) => {
            state.loading = false;
        })

    }
});

export const { changeTheme, changeStore } = userSlice.actions;
export default userSlice.reducer;
