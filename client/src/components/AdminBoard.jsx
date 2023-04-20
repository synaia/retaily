import React from "react";

import { Insights} from './Insights';

import '../../assets/style-admin.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadSales } from "../redux/features/sale.feature.js";

import { changeTheme } from "../redux/features/user.feature.js";


export const AdminBoard = ({Content, Title, Search}) => {
  const dispatch = useDispatch();
  const navigator = useNavigate()
  const [menu_open, set_menu_open] = useState("close");
  

  useEffect(() => {
    const highlightsted = [];
    const p = window.location.hash.split('/');
    let href = (p.length > 2) ? `${p[1]}/${p[2]}`: `${p[1]}`;
    const first = document.querySelector(`[href*="${href}"`);
    first.classList.toggle('active');
    highlightsted.push(first);

    const highlightsrow_selected_menu = (event) => {
      const element = event.currentTarget;
      console.log(element)
      if (highlightsted.length == 1) {
          highlightsted[0].classList.toggle('active');
          highlightsted.pop();
      }
      highlightsted.push(element);
      element.classList.toggle('active');
    };

    const sidebar = Array.from(document.querySelectorAll('.sidebar a'));
    sidebar.forEach(item => item.addEventListener('click', (event) => highlightsrow_selected_menu(event)));

  }, []);

  const hideSideBar = () => {
    document.querySelectorAll('.sidebar a').forEach(h => { h.classList.toggle('aside-width'); })
    document.querySelectorAll('.sidebar h3').forEach(h => { h.classList.toggle('aside-hide'); });
    document.querySelector('.container').classList.toggle('container-left-width');
    set_menu_open(menu_open == "menu" ? "close" : "menu");
  };


  useEffect(() => {
    // Change Theme
    const themeToggler = document.querySelector(".theme-toggler");
    themeToggler.addEventListener("click", () => {
      dispatch(changeTheme());
      themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
      themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
    });
  }, []);


  const Breadcrumbs = () => {
    let full_path = [];
      let ref = '';
    document.location.hash.split('/').forEach(path => {
      console.log(path)
      ref += '/' + path;
      if (path !== "#") {
        full_path.push(<a className="bread" href={ref}>> {path.toUpperCase()}  </a> );
      }
    });
    return full_path;
  };

  const fullpath = Breadcrumbs();
   
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
                <div className="sidebar-btn" onClick={() => hideSideBar()}>
                  <span className="material-icons-sharp"> {menu_open} </span>
                </div>
                <a href="/#/admin/">
                  <span className="material-icons-sharp"> dashboard </span>
                  <h3>Dashboard</h3>
                </a>
                <a href="/">
                  <span className="material-icons-sharp"> point_of_sale </span>
                  <h3>POS</h3>
                </a>
                {/* Test NavLink */}
                <a href="/#/admin/sales">
                  <span className="material-icons-sharp"> receipt_long </span>
                  <h3>Sales</h3>
                </a>
                <a href="/#/admin/inventory">
                  <span className="material-icons-sharp"> inventory </span>
                  <h3>Inventory</h3>
                </a>
                <a href="/#/admin/users">
                  <span className="material-icons-sharp"> person_outline </span>
                  <h3>Users</h3>
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
                <a href="/#/admin/inventory/newproduct">
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
                    <small className="text-muted">{[...fullpath]}</small>
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

             
             {Search}

             {Content}


            </main>

           
        </div>
    )
}