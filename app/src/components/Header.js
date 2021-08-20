// Importing necessary libraries and tools

import React, {useState} from 'react';
import session from '../services/session';
import {Redirect, NavLink} from 'react-router-dom';
import {swalError, swalForm, swalSuccess} from "../utils/swal";
import postService from "../services/post";

export default function Header(props) {
    const [redirectTo, setRedirectTo] = useState(null);

    const handleLogout = e => {
        e.preventDefault();
        props.onLogout();

        setTimeout(() => {
            session.clear();
            setRedirectTo('/');
        }, 500);
    }

    const handleCreate = e => {
        e.preventDefault();

        swalForm('', '', val => {
            postService.add(val.text, val.tags).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                swalSuccess('Post added successfully!');
                props.reload();
            });
        });
    }

    return (
        <div>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/" style={{color: 'purple', fontWeight: '500'}}>
                    <i className="fab fa-weixin" style={{fontSize: '26px', marginRight: '10px'}}></i>
                    Watch Buddy
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {
                        props.loggedIn !== true &&
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Feed <span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                    }
                    {
                        props.loggedIn === true &&
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Feed <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/users">Match Users</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile">My Profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/mine">My Posts</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/watch">Watch List</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/chat">Chat</a>
                            </li>
                        </ul>
                    }
                    <div className="navbar-nav ml-auto">
                        <input type="text" className="form-control mr-sm-2" placeholder="Search posts..."
                               value={props.searchKeyword} onChange={e => props.setSearchKeyword(e.target.value)}/>
                        {
                            props.loggedIn !== true &&
                            <ul className="navbar-nav pull-right">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/signup" style={{width: '80px'}}>Sign Up</NavLink>
                                </li>
                            </ul>
                        }
                        {
                            props.loggedIn === true &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {session.get('user') && session.get('user').fullname}
                                </a>
                                <div className="dropdown-menu dropdown-menu-right"
                                     aria-labelledby="navbarDropdownMenuLink">
                                    <button className="dropdown-item" onClick={e => setRedirectTo("/up")}>Update
                                        password
                                    </button>
                                    <button className="dropdown-item" onClick={e => handleLogout(e)}
                                            style={{color: 'red'}}><i className="fa fa-power-off"
                                                                      style={{marginRight: '5px'}}></i>Logout
                                    </button>
                                </div>
                            </li>
                        }
                    </div>
                </div>
            </nav>
        </div>
    );
}