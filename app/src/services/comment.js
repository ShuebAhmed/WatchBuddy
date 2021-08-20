// Importing necessary libraries and tools

import axios from 'axios';
import session from "./session";
import moment from "moment";

export default class {

    static add = async (postId, text) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            text: text,
            userId: session.get('user')._id,
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/comments`, data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response.data;
            });

        return result;
    }

    // static delete = async commentId => {
    //     let result = {
    //         data: null,
    //         error: null
    //     };

    //     const data = {
    //         userId: session.get('user')._id,
    //         commentId: commentId
    //     };

    //     await axios.post(`${process.env.REACT_APP_API_URL}/comments/remove`, data)
    //         .then(resp => {
    //             if (resp.status === 200) {
    //                 result.data = resp.data;
    //             }
    //         })
    //         .catch(err => {
    //             result.error = err.response.data;
    //         });

    //     return result;
    // }
}