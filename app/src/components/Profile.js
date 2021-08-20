// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import postService from "../services/post";
import {swalError} from "../utils/swal";

export default function Profile(props) {
    const [fullname, setFullname] = useState('');
    const [gender, setGender] = useState('');
    const [loverLevel, setLoverLevel] = useState('');
    const [age, setAge] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');
    const [bio, setBio] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        reload();
    }, []);

    const reload = () => {
        userService.get(session.get('user')._id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let data = result.data;
                setFullname(data.fullname);
                setGender(data.gender);
                setLoverLevel(data.loverLevel);
                setAge(data.age);
                setGenre(data.genre);
                setLanguage(data.language);
                setBio(data.bio);
                setProfilePictureUrl(`${process.env.REACT_APP_API_URL}/${data.pictureId}`);
            });
    }

    const updateProfile = async e => {
        e.preventDefault();

        if (!fullname) {
            setErrorMessage('Please provide your Full Name.');
            return;
        }

        let obj = {
            file: document.getElementById('file-profile').files[0],
            fullname, gender, loverLevel, age, genre, language, bio
        };

        await userService.updateProfile(obj)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const data = result.data;
                    setErrorMessage('');
                    setSuccessMessage("Profile updated successfully!");
                    session.set('user', data);

                    reload();
                }
            });
    }

    return (
        <div className="container text-center" style={{marginTop: '20px'}}>
            <div className="row">
                <div className="col-12 col-sm-12 text-center">
                    <h4>My Profile</h4>
                </div>
            </div>
            <div className="row" style={{marginTop: '20px'}}>
                <div className="col-12 col-sm-12">
                    <img src={profilePictureUrl} className="profile-image" alt="Not available" />
                    <br/>
                    <input
                        id="file-profile"
                        className="form-control form-control-sm fc-file text-center"
                        type="file"
                        accept="image/*"
                    />
                </div>
            </div>
            <div className="row" style={{marginTop: '20px'}}>
                <div className="col-12 col-sm-12">
                    <form onSubmit={updateProfile}>
                        <div className="form-group">
                            <input type="text" className="form-control m-2"
                                   placeholder="Full Name" required="required"
                                   value={fullname} onChange={e => setFullname(e.target.value)}/>
                            <select className="form-control m-2" value={gender}
                                    onChange={e => setGender(e.target.value)}>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Rather not say">Rather not say</option>
                            </select>
                            <select className="form-control m-2" value={loverLevel}
                                    onChange={e => setLoverLevel(e.target.value)}>
                                <option value="">Select Binge level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Casual">Casual</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Obsessed">Obsessed</option>
                            </select>
                            <input type="number" className="form-control m-2"
                                   placeholder="Age"
                                   value={age} onChange={e => setAge(e.target.value)}/>
                            <input type="text" className="form-control m-2"
                                   placeholder="Genre"
                                   value={genre} onChange={e => setGenre(e.target.value)}/>
                            <input type="text" className="form-control m-2"
                                   placeholder="Language"
                                   value={language} onChange={e => setLanguage(e.target.value)}/>
                            <input type="text" className="form-control m-2"
                                   placeholder="Bio"
                                   value={bio} onChange={e => setBio(e.target.value)}/>
                        </div>

                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <button type="submit" className="btn btn-outline-primary" onClick={updateProfile}>Update</button>

                    </form>
                </div>
            </div>
        </div>
    );
}