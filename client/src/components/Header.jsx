import React from "react";

export const Header = () => {

    return (
        <div className="header-content">
            <div>
                <h1>Dashboard</h1>
            </div>
            <div>
                <div className="right">
                <div className="top">
                    <button id="menu-btn">
                    <span className="material-icons-sharp"> menu </span>
                    </button>
                    <div className="theme-toggler-variant">
                    <span className="material-icons-sharp "> wifi </span>
                    <span className="material-icons-sharp"> print </span>
                    </div>
                    <div className="theme-toggler">
                    <span className="material-icons-sharp "> light_mode </span>
                    <span className="material-icons-sharp active"> dark_mode </span>
                    </div>
                    <div className="profile">
                    <div className="info">
                        <p>Hey, <b>Wilton</b></p>
                        <a href="/#/admin"><small className="text-muted">Admin</small></a>
                    </div>
                    <div className="profile-photo">
                        <img src="./assets/images/profile-1.png" alt="Profile Picture" />
                    </div>
                    </div>
                </div>      
                </div>
            </div>
        </div>
    )
}