// Importing necessary libraries and tools

import React, {useState} from 'react';
import {
    swalDeleteForm,
    swalError,
    swalSuccess
} from "../utils/swal";
import userService from "../services/user";
import conversationService from "../services/conversation";
import session from '../services/session';
import {Redirect} from "react-router-dom";

export default function User(props) {
    // state properties
    const [redirectTo, setRedirectTo] = useState(null);

    // onclick event to start chat with a matched user
    const handleChat = userId => {
        // calling our service method to create converstaion with found user
        // passing userIds of the users who are involved in this conversation
        conversationService.create([
            userId,
            session.get('user')._id
        ]).then(result => {
            if (result.data) {
                // after success,
                // redirect user to chat page
                setRedirectTo(`/chat`);
            }
        });
    }

    // return following UI on screen
    if(props.user)
    return (
        <div className="container text-center story-box">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col-6 text-left">
                    <h5 className="m-2"><a href={`/users/${props.user._id}`} title="Click to view all posts from this user.">{props.user.fullname}</a></h5>
                </div>
                <div className="col-6 text-right">
                    {
                        session.get('user') && session.get('user')._id !== props.user._id &&
                        <button className="btn btn-light btn-sm m-1" title="Delete this user"
                            onClick={e => handleChat(props.user._id)}><i className="fa fa-comment-dots m-1"></i>Chat Now</button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xs-12 col-sm-12 col-md-12 text-left">
                    <i className="fa fa-info-circle m-2"></i>{props.user.gender} <span className="badge badge-info">{props.user.loverLevel}</span><br />
                    <i className="fa fa-user m-2"></i>{props.user.fullname} <br />
                    <i className="fa fa-envelope-open m-2"></i>{props.user.email} <br />
                </div>
            </div>
        </div>
    );
}