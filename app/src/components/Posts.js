// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import postService from "../services/post";
import Post from './Post';
import TopPosts from './TopPosts';
import {swalError, swalSuccess, swalInfo, swalForm, swalLoading} from "../utils/swal";
import session from '../services/session';
import Swal from 'sweetalert2';

export default function Posts(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => reload())();
    }, [props.searchKeyword]);

    const handleCreate = e => {
        e.preventDefault();

        swalForm('', '', '', val => {
            swalLoading();
            postService.add(val.title, val.description, val.tags)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    Swal.close();
                    swalSuccess('Post added successfully!');
                    reload();
                });
        });
    }

    const reload = async () => {
        await postService.getAll(props.searchKeyword || "", null)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setData(result.data);
            });
    }

    const renderPosts = () =>
        data.map(post => <Post reload={reload} key={post._id} post={post} />);

    return (
        <div>
            <div className="row">
                <div className="col">
                    <h5 className="m-3">Top Posts</h5>
                </div>
                <div className="col text-right">
                    {
                        session.get('user')._id &&
                        <button className="btn btn-outline-primary m-3" onClick={e => handleCreate(e)}>Create Post</button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <TopPosts />
                </div>
            </div>

            <div className="row mt-30">
                <div className="col">
                    <p className="h5">Feed</p>
                    {data.length > 0 && renderPosts() || <div style={{marginLeft: '20px'}}>No posts found.</div>}
                </div>
            </div>
        </div>
    );
}