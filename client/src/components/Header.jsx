import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { lang } from "../common/spa.lang.js";

export const Header = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const printer = useSelector((state) => state.sale.printer);


    return (
        <div className="header-content">
            <div>
                <h1>{lang.pos.pos}</h1>
            </div>
            <div>
                <div className="right">
                <div className="top">
                    <button id="menu-btn">
                    <span className="material-icons-sharp"> menu </span>
                    </button>
                    <div className="theme-toggler-variant">
                    <span className="material-icons-sharp "> wifi </span>
                    {printer.isrunning == true &&
                        <span className="material-icons-sharp"> print </span>
                    }
                    {printer.isrunning == false &&
                        <span className="material-icons-sharp danger"> print_disabled </span>
                    }
                    </div>
                    <div className="theme-toggler">
                    <span className="material-icons-sharp "> light_mode </span>
                    <span className="material-icons-sharp active"> dark_mode </span>
                    </div>
                    <div className="profile">
                        <div className="info">
                        {currentUser && currentUser.selectedStore &&
                            <a href="/#/admin">
                            <p><b>{currentUser.first_name}</b>@{currentUser.selectedStore}</p>
                            </a>
                        }
                        </div>
                        <div className="profile-photo">
                        {currentUser &&
                            <img src={currentUser.pic} alt="Profile Picture" />
                        }
                        </div>
                    </div>
                </div>      
                </div>
            </div>
        </div>
    )
}