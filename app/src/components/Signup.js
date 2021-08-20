// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import {swalInfo} from '../utils/swal';

export default function Signup(props) {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    const handleSignup = async e => {
        e.preventDefault();
        if(!fullname || fullname.length === 0) {
            swalInfo(`Full Name is required.`);
            return;
        }
        if(!email || email.length === 0) {
            swalInfo(`Email is required.`);
            return;
        } else {
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
                swalInfo(`Please enter a valid email address.`);
                return;
            }
        }
        if(!password || password.length === 0) {
            swalInfo(`Password is required.`);
            return;
        }

        await userService.signup(fullname, email, password)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Signup successful! Redirecting...");

                    session.set('loggedIn', true);
                    session.set('user', data);
                    props.onLogin();
                    setRedirectTo('/');
                }
            });
    }

    const formatFullname = e => {
        e.preventDefault();
        let splitStr = fullname.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++)
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);

        setFullname(splitStr.join(' '));
    }

    return (
        <div className="container-fluid text-center div-signup" style={{marginTop: '50px', width: '600px'}}>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <input type="text" className="form-control" id="txtSignupFullname"
                                   placeholder="Full Name" required="required" onBlur={formatFullname}
                                   value={fullname} onChange={e => setFullname(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control"
                                   placeholder="Email" required="required"
                                   value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control"
                                   placeholder="Password" required="required"
                                   value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <a href="/login" className="btn btn-link">Login here</a>

                        <button type="submit" className="btn btn-outline-primary"
                                onClick={e => handleSignup(e)}>Sign Up
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}