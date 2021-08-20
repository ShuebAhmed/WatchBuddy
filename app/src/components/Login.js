// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';

export default function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
    }, []);

    const handleLogin = async e => {
        e.preventDefault();

        await userService.login({email: email, password: password})
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Login successful! Redirecting...");

                    session.set('loggedIn', true);
                    session.set('user', data);
                    props.onLogin();
                    setRedirectTo(`/`);
                }
            });
    }

    return (
        <div className="container-fluid text-center div-login" style={{marginTop: '50px', width: '600px'}}>
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <h2 className="m-4">Login</h2>
                    <form onSubmit={handleLogin}>
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

                        <a href="/signup" className="btn btn-link">Sign Up here</a>

                        <button type="submit" className="btn btn-outline-primary" onClick={e => handleLogin(e)}>Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}