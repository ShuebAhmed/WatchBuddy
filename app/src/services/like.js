// Importing necessary libraries and tools

import axios from 'axios';
import session from "./session";
import moment from "moment";

export default class {

    static add = async postId => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            userId: session.get('user')._id,
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes`, data)
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

    static check = async postId => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            date: moment().format(),
            userId: session.get('user')._id,
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes/check`, data)
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

    static delete = async postId => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            userId: session.get('user')._id,
            postId: postId
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/likes/remove`, data)
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
}