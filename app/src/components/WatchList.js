// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import session from '../services/session';
import {Redirect} from 'react-router-dom';

export default function WatchList(props) {

    const [movies, setMovies] = useState('');
    const [planned, setPlanned] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        reload();
    }, []);

    const reload = () => {userService.get(session.get('user')._id)
        .then(result => {
            if (result.error) {
                setErrorMessage(result.error);
                return;
            }

            if (result.data) {
                const data = result.data;
                setMovies(data.movies);
                setPlanned(data.planned);
            }
        });
    }

    const handleAddMovie = async e => {
        e.preventDefault();

        await userService.addMovie(movies)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }
                setSuccessMessage(`Watch list uppdated successfully!`);
                reload();
            });
    }

    const handleAddPlanned = async e => {
        e.preventDefault();

        await userService.addPlanned(planned)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }
                setSuccessMessage(`Planned list uppdated successfully!`);
                reload();
            });
    }

    return (
        <div className="container-fluid">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col">
                    <h2 className="m-4">Watched</h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <textarea className="form-control"
                           placeholder="Comma separated list of movies"
                           value={movies} onChange={e => setMovies(e.target.value)}/>
                    <small>* Comma separated list of movies</small>
                </div>
            </div>
            <div className="row mt-30 text-right">
                <div className="col">
                    <button type="submit" className="btn btn-outline-primary" onClick={handleAddMovie}>Save changes</button>
                </div>
            </div>
            <div className="row mt-30">
                <div className="col">
                    <h2 className="m-4">Plan to Watch</h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <textarea className="form-control"
                              placeholder="Comma separated list of movies"
                              value={planned} onChange={e => setPlanned(e.target.value)}/>
                    <small>* Comma separated list of movies</small>
                </div>
            </div>
            <div className="row mt-30 text-right">
                <div className="col">
                    <button type="submit" className="btn btn-outline-primary" onClick={handleAddPlanned}>Save changes</button>
                </div>
            </div>
            <div className="row mt-30">
                <div className="col">
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                </div>
            </div>
        </div>
    );
}