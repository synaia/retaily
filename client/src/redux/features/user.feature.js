import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios, { AxiosError } from "axios";
import axios from "axios";


import { persistUser, getLastLoggedUser, getPreferences, persistPreference } from "../../api/db";
import { BACKEND_HOST } from "../../util/constants";
import { beauty, solveResponse } from "../../util/Utils";

const LOGIN = '/#/admin/users/login';

let current = await getLastLoggedUser('url:user.feature.js');
if (!current)
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
    },
    users: [],
    scopes: [],
};

export const interceptor = createAsyncThunk('interceptor/util', async (args, thunkAPI) => {
    axios.interceptors.request.clear();

    axios.interceptors.request.use(
        async (config) => {
            if (config.url.includes('/users/token')) {
                return config;
            }
            if (config.url.includes('/products/uploadfile')) {
                return config;
            }
            if (config.url.includes('/products/uploadfilelocal')) { 
                return config;
            }
            if (config.url.includes('inventory/takephoto')) { 
                return config;
            }
            const U = await getLastLoggedUser(config.url);
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
        return solveResponse(resp);
    }).catch( err => {
        args.loggeSucess(false);
        return solveResponse(err);
    });
});

export const users = createAsyncThunk('users/get', async () => {
    return await Axios.get(
        `${BACKEND_HOST}/users`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const logout = createAsyncThunk('users/logout', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/logout`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});


export const addUser = createAsyncThunk('users/add', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/add`, args, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const scopes = createAsyncThunk('users/scopes', async () => {
    return await Axios.get(
        `${BACKEND_HOST}/users/scopes`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const addScope = createAsyncThunk('users/add_scope', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/add_scope`, args, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const deleteScope = createAsyncThunk('users/delete_scope', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/delete_scope`, args, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const addStores = createAsyncThunk('users/add_stores', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/add_stores`, args, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
    });
});

export const deleteStores = createAsyncThunk('users/add_stores', async (args) => {
    return await Axios.post(
        `${BACKEND_HOST}/users/delete_stores`, args, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then( resp => {
        return solveResponse(resp);
    }).catch( err => {
        return solveResponse(err);
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
            const store = action.payload; 
            state.currentUser.selectedStore = store.name;
            state.currentUser.store = store;
            persistUser(beauty(state.currentUser));
        }
    },
    extraReducers: (builder) => {
        builder.addCase(auth.pending, (state, action) => {
            state.loading = true;
        }).addCase(auth.fulfilled, (state, action) => {
            state.loading = false;
            const { data: user, status, detail } = action.payload
            if (status >= 200 && status <= 300) {
                if (user?.stores.length > 0) {
                    const store_default = (user?.stores.length == 1) ? user?.stores[0].name : undefined;
                    user.selectedStore = store_default;
                    user.store = user?.stores[0];
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
            const { data: user, status, detail } = action.payload
            if (status >= 200 && status <= 300) {
                user.is_logout = true;
                persistUser(user);
                state.currentUser = user; // expired token - user
                state.errorMessage = '';
            } else {
                state.errorMessage = detail;
            }
            state.loading = false;
        }).addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.error.message;
        });

        builder.addCase(users.pending, (state, action) => {
            state.loading = true;
        }).addCase(users.fulfilled, (state, action) => {
            const { data, status, detail } = action.payload
            if (status >= 200 && status <= 300) {
                state.users = data;
                state.errorMessage = '';
            } else {
                state.errorMessage = detail;
            }
            state.loading = false;
        }).addCase(users.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.error.message;
        });

        builder.addCase(scopes.pending, (state, action) => {
            state.loading = true;
        }).addCase(scopes.fulfilled, (state, action) => {
            const { data, status, detail } = action.payload
            if (status >= 200 && status <= 300) {
                state.scopes = data;
                state.errorMessage = '';
            } else {
                state.errorMessage = detail;
            }
            state.loading = false;
        }).addCase(scopes.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.error.message;
        });

    }
});

export const { changeTheme, changeStore } = userSlice.actions;
export default userSlice.reducer;
