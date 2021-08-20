// import the User model
const User = require('../models/user');

// create object containing all methods related to User model,
// so that we can call them from a single place
const Manager = {
    // method to get a User by its ID
    getById: async id => {
        const t = await User.findById(id);
        if (t === null)
            return false;

        return t;
    },
    // method to get a User by its username
    getByUsername: async username => {
        const t = await User.findOne({ username: username });
        if (t === null)
            return false;

        return t;
    },
    // method to get a User by its email
    getByEmail: async email => {
        const t = await User.findOne({ email: email });
        if (t === null)
            return false;

        return t;
    },
    // creating new user in database
    create: async t => {
        let user = new User({ ...t });
        const r = await user.save();
        if (r === null)
            return false;

        return r;
    },
    // updating password
    updatePassword: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            password: data.password
        });
        return t ? t : false;
    },
    // updating all profile values
    updateProfile: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            fullname: data.fullname,
            gender: data.gender,
            loverLevel: data.loverLevel,
            age: data.age,
            pictureId: data.pictureId,
            genre: data.genre,
            language: data.language,
            bio: data.bio
        });
        return t ? t : false;
    },
    // updating moveis
    updateMovies: async (id, movies) => {
        let t = await User.findByIdAndUpdate(id, {
            movies: movies
        });
        return t ? t : false;
    },
    // updating planned list
    updatePlanned: async (id, movies) => {
        let t = await User.findByIdAndUpdate(id, {
            planned: movies
        });
        return t ? t : false;
    },
    // get list of all users
    list: async keyword => {
        const t = await User.aggregate([
            {
                $match: {
                    $or: [
                        {fullname: {$regex: keyword, $options: 'i'}},
                        {username: {$regex: keyword, $options: 'i'}},
                        {email: {$regex: keyword, $options: 'i'}}
                    ]
                }
            }]);

        if (t === null)
            return false;

        return t;
    },
    // get matching
    matching: async user => {
        const t = await User.aggregate([
            {
                $match: {
                    $or: [
                        {loverLevel: {$regex: user.loverLevel, $options: 'i'}}
                    ]
                }
            }]);

        if (t === null)
            return false;

        return t;
    },
    // delete a user by its ID
    deleteById: async id => {
        const t = await User.findByIdAndDelete(id);
        if (t === null)
            return false;

        return t;
    },
};

module.exports = Manager;