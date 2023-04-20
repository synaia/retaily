/**
 * @file Init.jsx
 * @author Wilton Beltre
 * @description  load resources one-time, I hope.
 * @version 1.0.0
 * @license MIT
 */


import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


export const Theme = () => {
    const theme = useSelector((state) => state.user.theme);

    useEffect(() => {
        if (theme.ui_theme == undefined) {
            document.body.classList.remove(theme.dark_theme_base);
          } else {
            document.body.classList.add(theme.dark_theme_base);
          }
    }, [theme]);
    

    return (
        <React.Fragment></React.Fragment>
    );
};