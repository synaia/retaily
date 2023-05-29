import React from "react";

import { Insights} from './Insights';

import '../../assets/style-admin.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadSales } from "../redux/features/sale.feature.js";

import { changeTheme } from "../redux/features/user.feature.js";
import package_file from "../../package.json";


export const AdminBoardBulk = ({Content, Title, Search, Key}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
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

  useEffect(() => {
    // document.title = `${Title} ${package_file.name} ${package_file.version}`;
    document.title = Title;
  });

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
      ref += '/' + path;
      if (path !== "#") {
        full_path.push(<a className="bread" href={ref}>> {path.toUpperCase()}  </a> );
      }
    });
    return full_path;
  };

  const fullpath = Breadcrumbs();
   
    return (
          <div className="container container-left-width-bulk" key={1}>
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