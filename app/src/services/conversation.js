// Importing necessary libraries and tools

import axios from 'axios';
import session from '../services/session';

export default class {

    static create = async members => {
        let result = {
            data: null,
            error: null
        };

        const data =  {
            joined: Date.now(),
            members: members
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/conversations/create`, data)
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

    static getAll = async () => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/conversations/all/${session.get('user')._id}`)
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

    static getMessages = async (token, conversationId) => {
        let result = {
            data: null,
            error: null
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/conversations/${conversationId}`,
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
}