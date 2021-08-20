// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import userService from "../services/user";
import User from './User';
import {swalError} from "../utils/swal";

export default function Users(props) {

    // setting up some state variables
    const [data, setData] = useState(null);

    // onclick event for when user will click on find match button
    const handleFindMatch = e => {
        e.preventDefault();
        // calling our API service to get matched users
        userService.getMatching()
            .then(result => {
                if (result.error) {
                    // show alert in case of any error
                    swalError(`Please update your profile.`);
                    return;
                }

                // set data in state received from server
                setData(result.data);
            });
    }

    // method that would render all Users on the screen
    // we are rendering separate User component for each record and passing data in it as props
    const renderUsers = () => data.map(user => <User key={user._id} user={user} />);

    return (
        // return UI for the User page
        <div className="container-fluid">
            <div className="row mt-30 text-center">
                <div className="col-12">
                    <h2>Find your perfect match!</h2>
                    <br/>
                    <button className="btn btn-lg btn-primary" onClick={handleFindMatch}>
                        Find my match!<i className="fa fa-heart m-1 red"></i>
                    </button>
                </div>
            </div>
            <div className="row mt-30">
                <div className="col-sm-12 col-md-12">
                    {data && renderUsers()}
                </div>
            </div>
        </div>
    );
}