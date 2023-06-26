import React from "react";

import { Insights} from './Insights';

import '../../assets/style-admin.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadSales, setErrViewedSale } from "../redux/features/sale.feature.js";
import { logout } from "../redux/features/user.feature.js";

import { changeTheme, addMessagesCount, setErrViewedUser } from "../redux/features/user.feature.js";
import { setErrViewedProduct } from "../redux/features/product.feature.js";
import { setErrViewedClient } from "../redux/features/client.feature.js";

import EventBus from "../common/EventBus"
import package_file from "../../package.json";
import { SCOPES } from "../util/constants";

import { lang } from "../common/spa.lang.js";
import { beauty } from "../util/Utils";



export const AdminBoard = ({Content, Title, Search}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const messages = useSelector((state) => state.user.messages);
  const messages_count = useSelector((state) => state.user.messages_count);
  const errorMessageUser = useSelector((state) => state.user.errorMessage);
  const errorMessageProduct = useSelector((state) => state.product.errorMessage);
  const errorMessageSale = useSelector((state) => state.sale.errorMessage);
  const errorMessageClient = useSelector((state) => state.client.errorMessage);
  const error_viewed = useSelector((state) => state.user.error_viewed);
  const [errorMessage, SetErrorMessage] = useState([]);
  const dispatch = useDispatch();
  const navigator = useNavigate()
  const [menu_open, set_menu_open] = useState("close");


  useEffect(() => {
    SetErrorMessage([...errorMessage, [...errorMessageProduct.errors]]);
  }, [errorMessageProduct.errors]);

  useEffect(() => {
    SetErrorMessage([...errorMessage, [...errorMessageUser.errors]]);
  }, [errorMessageUser.errors]);

  useEffect(() => {
    SetErrorMessage([...errorMessage, [...errorMessageSale.errors]]);
  }, [errorMessageSale.errors]);

  useEffect(() => {
    SetErrorMessage([...errorMessage, [...errorMessageClient.errors]]);
  }, [errorMessageClient.errors]);



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


  useEffect(() => {
    if (messages.length > 0 && messages_count != messages.length) {      
      dispatch(addMessagesCount());

      const toast = document.querySelector(".toast");
      const closeIcon = document.querySelector(".message-close");
      const progress = document.querySelector(".progress");

      let timer1, timer2;

      toast.classList.add("active");
      progress.classList.add("active");

      timer1 = setTimeout(() => {
          toast.classList.remove("active");
      }, 15000); //1s = 1000 milliseconds

      timer2 = setTimeout(() => {
        progress.classList.remove("active");
      }, 15300);
      
      closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        
        setTimeout(() => {
          progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
      });
    }
  }, [messages])


  const showErrr = () => {
    return (errorMessageProduct.notify  == false || errorMessageUser.notify  == false ||  errorMessageSale.notify  == false || errorMessageClient.notify  == false )
  }

  useEffect(() => {
    if (errorMessage && errorMessage.length > 0 && showErrr() ) {      
      const toast = document.querySelector(".toast-err");
      const closeIcon = document.querySelector(".message-err-close");
      const progress = document.querySelector(".progress");

      let timer1, timer2;

      toast.classList.add("active");
      progress.classList.add("active");

      // timer1 = setTimeout(() => {
      //     toast.classList.remove("active");
      // }, 15000); //1s = 1000 milliseconds

      // timer2 = setTimeout(() => {
      //   progress.classList.remove("active");
      // }, 15300);
      
      closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        
        setTimeout(() => {
          progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
      });

      dispatch(setErrViewedUser());
      dispatch(setErrViewedProduct());
      dispatch(setErrViewedSale());
      dispatch(setErrViewedClient());
    }
  }, [errorMessage])


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

  const onLogout = (event) => {
    dispatch(logout());
    event.preventDefault();

  }
   
    return (
          <div className="container">


          <div className="toast">
            <div className="toast-content">
                <div className="icon">
                    <span className="material-icons-sharp message-mail"> mark_email_unread </span>
                </div>

                <div className="toast-message">
                    <span className="">{lang.messages.new_messages(messages.length)}</span>
                </div>
            </div>
            <span className="material-icons-sharp message-close"> close </span>

            <div className="progress"></div>
          </div>


          <div className="toast-err">
            <div className="toast-err-content">
                <div className="icon">
                    <span className="material-icons-sharp message-warning"> warning </span>
                </div>

                <div className="toast-err-message">
                { errorMessage.map( (msg, i) => (
                  <li className="">{msg}</li>
                ))
                }
                  
                </div>
            </div>
            <span className="material-icons-sharp message-err-close"> close </span>

            <div className="progress"></div>
          </div>

        

            
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

             {currentUser &&
              <div className="sidebar">
                <div className="sidebar-btn" onClick={() => hideSideBar()}>
                  <span className="material-icons-sharp"> {menu_open} </span>
                </div>
                {currentUser.scopes.includes(SCOPES.DASHBOARD.VIEW) &&
                <a href="/#/admin/" key={1}>
                  <span className="material-icons-sharp"> dashboard </span>
                  <h3>{lang.menu.dashboard}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.SALES.POS) &&
                <a href="/#" key={2}>
                  <span className="material-icons-sharp"> point_of_sale </span>
                  <h3>{lang.menu.pos}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.SALES.VIEW) &&
                <a href="/#/admin/sales" key={3}>
                  <span className="material-icons-sharp"> receipt_long </span>
                  <h3>{lang.menu.sales}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.INVENTORY.VIEW) &&
                <a href="/#/admin/inventory" key={4}>
                  <span className="material-icons-sharp"> inventory </span>
                  <h3>{lang.menu.inventory}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.USER.VIEW) &&
                <a href="/#/admin/users">
                  <span className="material-icons-sharp"> person_outline </span>
                  <h3>{lang.menu.users}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.REPORT.VIEW) &&
                <a href="#" key={6}>
                  <span className="material-icons-sharp"> report_gmailerrorred </span>
                  <h3>{lang.menu.reports}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.ANALYTIC.VIEW) &&
                <a href="#" key={7}>
                  <span className="material-icons-sharp"> insights </span>
                  <h3>{lang.menu.analytics}</h3>
                </a>
                }

                <a href="/#/admin/messages" key={8}>
                  <span className="material-icons-sharp"> mail_outline </span>
                  <h3>{lang.menu.messages}</h3>
                  <span className="message-count">{messages.length}</span>
                </a>

                {currentUser.scopes.includes(SCOPES.USER.SETTING) &&
                <a href="#" key={9}>
                  <span className="material-icons-sharp"> settings </span>
                  <h3>{lang.menu.settings}</h3>
                </a>
                }
                {currentUser.scopes.includes(SCOPES.PRODUCT.ADD) &&
                <a href="/#/admin/inventory/newproduct" key={10}>
                  <span className="material-icons-sharp"> add </span>
                  <h3>{lang.menu.add_product}</h3>
                </a>
                }
                <a href="#" key={11} onClick={(e) => onLogout(e)}>
                  <span className="material-icons-sharp"> logout </span>
                  <h3>{lang.menu.logout}</h3>
                </a>
              </div>
              }
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

             
             {Search}

             {Content}


            </main>

           
        </div>
    )
}