// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import postService from '../services/post';
import {Redirect} from 'react-router-dom';
import {swalError} from "../utils/swal";
import Post from "./Post";

export default function UserPosts(props) {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [redirectTo, setRedirectTo] = useState(null);
    useEffect(() => {
        reload();
    }, []);

    const reload = async () => {
        let id = window.location.href.split('/').pop();
        await postService.getByUserId(id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setPosts(result.data);
                if(result.data.length > 0) {
                    setUser(result.data[0].userId);
                }
            });
    }

    const renderPosts = () =>
        posts.map(post => <Post reload={reload} key={post._id} post={post}/>);

    return (
        <div className="">
            {redirectTo && <Redirect push to={redirectTo}/>}
            <div className="row">
                <div className="col"><h2 className="m-3">User Profile</h2></div>
                <div className="col text-right">
                    <button className="btn btn-light btn-sm m-2" onClick={() => setRedirectTo('/')}>Back to
                        Feed
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-9">
                    {user && <span className="h3 m-3">Posts from {user.fullname}</span>}
                    {posts.length > 0 && renderPosts()}
                    {posts.length === 0 && <div style={{marginLeft: '20px'}}>No posts found.</div>}
                </div>
                {
                    user &&
                    <div className="col-3 bg-light text-center">
                        <h3 className="mt-30">{user.fullname}'s Profile</h3>
                        <img src={`${process.env.REACT_APP_API_URL}/${user.pictureId}`} className="profile-image" alt="Not available" />
                        <table className="w-100 mt-20 tbl-profile">
                            <tr>
                                <td>Email</td><td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>Binge level</td><td>{user.loverLevel}</td>
                            </tr>
                            <tr>
                                <td>Age</td><td>{user.age}</td>
                            </tr>
                            <tr>
                                <td>Genre</td><td>{user.genre}</td>
                            </tr>
                            <tr>
                                <td>Language</td><td>{user.language}</td>
                            </tr>
                            <tr>
                                <td>Watched list</td><td>{user.movies.split(",").map(m => <span className="badge badge-light m-1">{m}</span>)}</td>
                            </tr>
                            <tr>
                                <td>Plan to watch list</td><td>{user.planned.split(",").map(m => <span className="badge badge-light m-1">{m}</span>)}</td>
                            </tr>
                        </table>
                    </div>
                }
            </div>
        </div>
    );
}