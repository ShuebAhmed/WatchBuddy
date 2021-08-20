// Importing necessary libraries and tools

import axios from 'axios';

export default class {

    static create = async (token, obj) => {
        let result = {
            data: null,
            error: null
        };

        const data =  {
            conversationId: obj.conversationId,
            date: Date.now(),
            authorId: obj.authorId,
            body: obj.body
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/conversations/create`, data,
            { headers: { 'alshorja_auth': token }})
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

    static getAll = async conversationId => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/messages/${conversationId}`)
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