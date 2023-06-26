import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { lang } from "../common/spa.lang.js";
import { changeTheme, addMessagesCount, setErrViewedUser,  } from "../redux/features/user.feature.js";
import { setErrViewedProduct } from "../redux/features/product.feature.js";
import { setErrViewedClient } from "../redux/features/client.feature.js";
import { setErrViewedSale } from "../redux/features/sale.feature.js";

export const Header = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const messages = useSelector((state) => state.user.messages);
    const messages_count = useSelector((state) => state.user.messages_count);
    const printer = useSelector((state) => state.sale.printer);

    const errorMessageUser = useSelector((state) => state.user.errorMessage);
    const errorMessageProduct = useSelector((state) => state.product.errorMessage);
    const errorMessageSale = useSelector((state) => state.sale.errorMessage);
    const errorMessageClient = useSelector((state) => state.client.errorMessage);

    const [errorMessage, SetErrorMessage] = useState([]);

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


    return (
    <>
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
    </>
    )
}