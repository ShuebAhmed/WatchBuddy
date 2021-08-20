// Importing necessary libraries and tools

import axios from 'axios';
import session from "./session";
import moment from "moment";

export default class {

    static getAll = async (keyword, userId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/all`, {keyword: keyword, userId: userId})
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

    static getPostsFromImFollowing = async keyword => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            keyword: keyword,
            userId: session.get('user')._id,
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/following`, data)
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

    static getTopPosts = async () => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/top`)
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

    static getByUserId = async userId => {
        let result = {
            data: null,
            error: null
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/all`, {userId: userId})
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch((err) => {
                result.error = err.response.data;
            });

        return result;
    }

    static add = async (title, description, tags) => {
        let result = {
            data: null,
            error: null
        };
        const data = {
            title, description, tags,
            userId: session.get('user').id,
            date: moment().format()
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts`, data)
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

    static get = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
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

    static delete = async id => {
        let result = {
            data: null,
            error: null
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`)
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

    static update = async (id, title, description, tags) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            title, description, tags
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/posts/${id}`, data)
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