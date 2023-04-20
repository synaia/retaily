import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    theme: {
        ui_theme: undefined,
        grid_theme: undefined,
        dark_theme_base: 'dark-theme-variables',
    }
};


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
    }
});

export const { changeTheme } = userSlice.actions;
export default userSlice.reducer;
