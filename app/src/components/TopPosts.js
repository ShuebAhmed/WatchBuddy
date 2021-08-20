// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import postService from "../services/post";
import TopPost from './TopPost';
import {swalError} from "../utils/swal";


export default function TopPosts(props) {
//initialising
    const [data, setData] = useState([]);

    useEffect(() => {
        reload();
        setInterval(() => reload(), 2000);
    }, []);

    const reload = async () => {
        await postService.getTopPosts()
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let t = result.data.filter(x => x.likes.length > 0);
                t = t.sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);
                setData(t);
            });
    }

    const renderPosts = () =>
        data.map(post => <TopPost reload={reload} key={post._id} post={post} />);

    return (
        <div className="container-fluid top-posts">
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    {data.length > 0 && renderPosts() || <div style={{marginLeft: '20px'}}>No posts found.</div>}
                </div>
            </div>
        </div>
    );
}