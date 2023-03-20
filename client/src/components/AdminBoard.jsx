import React from "react";

import { Insights} from './Insights';

import '../../assets/style-admin.css';

import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";

export const AdminBoard = ({Content, Title, Search}) => {
  const dispatch = useDispatch();


  useEffect(() => {
    const highlights = (sidebar, item) => {
      console.log('highlights');
      sidebar.forEach(item => item.classList.remove('active'));
      item.classList.add('active');
    };
    const sidebar = Array.from(document.querySelectorAll('.sidebar a'));
    sidebar.forEach(item => item.addEventListener('click', () => highlights(sidebar, item)));

  }, []);


  useEffect(() => {
    // Change Theme
    const themeToggler = document.querySelector(".theme-toggler");
    themeToggler.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme-variables");
        themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
        themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
    });
  });

   
    return (
          <div className="container">
            <aside>
              <div className="top">
                <div className="logo">
                  <img src="./assets/images/evofit-logo.png" alt="Logo" />
                  <h2><span className="danger">EVO</span>FIT</h2>
                </div>
                <div className="close" id="close-btn">
                  <span className="material-icons-sharp"> close </span>
                </div>
              </div>

              <div className="sidebar">
                <a href="/#/admin/" className="active">
                  <span className="material-icons-sharp"> dashboard </span>
                  <h3>Dashboard</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> point_of_sale </span>
                  <h3>POS</h3>
                </a>
                <a href="/#/admin/sales">
                  <span className="material-icons-sharp"> receipt_long </span>
                  <h3>Sales</h3>
                </a>
                <a href="/#/admin/users">
                  <span className="material-icons-sharp"> person_outline </span>
                  <h3>Users</h3>
                </a>
                <a href="/#/admin/products">
                  <span className="material-icons-sharp"> inventory </span>
                  <h3>Products</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> report_gmailerrorred </span>
                  <h3>Reports</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> insights </span>
                  <h3>Analytics</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> mail_outline </span>
                  <h3>Messages</h3>
                  <span className="message-count">26</span>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> settings </span>
                  <h3>Settings</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> add </span>
                  <h3>Add Product</h3>
                </a>
                <a href="#">
                  <span className="material-icons-sharp"> logout </span>
                  <h3>Logout</h3>
                </a>
              </div>
            </aside>

            <main>
            <div className="header-content">
                <div>
                    <h1>{Title}</h1>
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
                                <p>Hey, <b>Bruno</b></p>
                                <a href="/#/admin"><small className="text-muted">Admin</small></a>
                            </div>
                            <div className="profile-photo">
                                <img src="./assets/images/profile-1.jpg" alt="Profile Picture" />
                            </div>
                            </div>
                        </div>      
                      </div>
                  </div>
              </div>

             
             {Search}

             {Content}


            </main>

           
        </div>
    )
}