// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import session from '../services/session';
import {Redirect} from 'react-router-dom';
import moment from "moment";
import {swalError, swalInfo, swalRemoveLike, swalShare, swalSuccess} from "../utils/swal";
import likeService from "../services/like";
import dislikeService from "../services/dislike";

moment.locale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s:  '1s',
        ss: '%ss',
        m:  '1m',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  '1d',
        dd: '%dd',
        M:  '1m',
        MM: '%dM',
        y:  '1y',
        yy: '%dy'
    }
});

export default function TopPost(props) {

    const [redirectTo, setRedirectTo] = useState(null);

    const handleUpvote = e => {
        e.preventDefault();
        if (!session.get('user') || !session.get('user')._id) {
            swalInfo(`Please signup/login to like.`);
            return;
        }

        likeService.check(props.post._id).then(result => {
            if (result.error) {
                swalError(result.error);
                return;
            }

            if (result.data.length > 0) {
                swalRemoveLike(`You already have Liked this post. Do you want to remove your like?`, () => {
                    likeService.delete(props.post._id).then(result => {
                        if (result.error) {
                            swalError(result.error);
                            return;
                        }

                        swalSuccess('Your like is removed successfully!');
                        props.reload();
                    });
                });
            } else {
                likeService.add(props.post._id).then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    swalSuccess('Post liked successfully!');
                    props.reload();
                });
            }
        });
    }

    const handleDownvote = e => {
        e.preventDefault();

        if (!session.get('user') || !session.get('user')._id) {
            swalInfo(`Please signup/login to like.`);
            return;
        }

        dislikeService.check(props.post._id).then(result => {
            if (result.error) {
                swalError(result.error);
                return;
            }

            if (result.data.length > 0) {
                swalRemoveLike(`You already have Disliked this post. Do you want to remove your like?`, () => {
                    dislikeService.delete(props.post._id).then(result => {
                        if (result.error) {
                            swalError(result.error);
                            return;
                        }

                        swalSuccess('Your dislike is removed successfully!');
                        props.reload();
                    });
                });
            } else {
                dislikeService.add(props.post._id).then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    swalSuccess('Post disliked successfully!');
                    props.reload();
                });
            }
        });
    }

    const handleShare = e => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_APP_URL}/posts/${props.post._id}`;
        swalShare(url);
    }

    const handleOpenPost = () => {
        const url = `/posts/${props.post._id}`;
        setRedirectTo(url);
    }

    return (
        <div>
            <div className="container-fluid text-center story-box top">
                {redirectTo && <Redirect push to={redirectTo}/>}
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 text-left">
                        <a className="m-1" href={`/users/${props.post.userId._id}`}>{props.post.userId.fullname}</a>
                        <span
                            className="badge badge-pill badge-light m-1">{moment(props.post.date).fromNow(true)}</span>
                        <span className="badge badge-pill badge-light badge-like m-1" onClick={handleUpvote}
                              title="Like this post">
                        <i className="fa fa-thumbs-up"></i> {props.post.likes.length}</span>
                        <span className="badge badge-pill badge-light badge-like m-1" onClick={handleDownvote}
                              title="Dislike this post">
                        <i className="fa fa-thumbs-down"></i> {props.post.dislikes.length}</span>
                        <span className="badge badge-pill badge-light badge-like m-1"
                              title="Comments on this post">
                        <i className="fa fa-comments"></i> {props.post.comments.length}</span>
                        <span className="badge badge-pill badge-light m-1" style={{cursor: 'pointer'}}
                              title="Share this post" onClick={handleShare}>
                        <i className="fa fa-share"></i></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 text-left">
                        <span className="story-body" title="Click to open the post in new page"
                                onClick={handleOpenPost}>
                            <span style={{fontWeight:'bold'}}>{props.post.title}</span> <br/>
                            {props.post.description}
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-12 col-sm-12 col-md-12 text-left" style={{paddingTop: '10px'}}>
                        <span className="tags"><i className="fa fa-hashtag"></i>{props.post.tags}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}