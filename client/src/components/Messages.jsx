import React from "react";
import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { lang } from "../common/spa.lang.js";


export const Messages = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const messages = useSelector((state) => state.user.messages);
    const users = useSelector((state) => state.user.users);
    const loading = useSelector((state) => state.user.loading);
    const errorMessage = useSelector((state) => state.user.errorMessage);
    const navigator = useNavigate();

    useEffect(() => {
        console.log('Hey messages', messages);
    }, [messages]);

   const getUserPic = (username) => {
    console.log('username', username)
    const user = users.find(u => u.username == username)
    return user.pic;
   }


    return (
        <React.Fragment>            
            <div className="movement-top">
            { messages.map( (msg, i) => (
                    <div className="message-grid" key={i} onClick={() =>  navigator(`/admin/inventory/storemovresp/${msg.body.order.id}`, {replace: false})}>
                        <div className={`message-${msg.marker}`}></div>
                        <div className="message-grid-c">
                            <div className="info">
                                <h3>{lang.messages[msg.origin]} </h3>
                            </div>
                            <div className="info">
                                <h3>{msg.body.order.memo} | {msg.body.order.name}</h3>
                                <small className="text-muted"> {lang.storemov.name}  </small>
                            </div>
                            {/* <div className="info">
                                <div className="profile-photo">
                                  <img src={getUserPic(msg.body.order.user_receiver)} alt="Profile Picture" />
                              </div>
                            </div> */}
                        </div>
                    </div>
                ))
            }
            </div>
        </React.Fragment>
    )
};