const mongoose = require("mongoose");

const options = {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
};

// user model with all its properties
const schema = new mongoose.Schema(
    {
        fullname: { type: String, require: true },
        email: { type: String, require: true },
        password: { type: String, require: true },
        gender: { type: String, require: false },
        loverLevel: { type: String, require: false },
        age: { type: Number, require: false },
        pictureId: { type: String, require: false },
        genre: { type: String, require: false },
        language: { type: String, require: false},
        bio: { type: String, require: false},
        movies: { type: String, require: false, default: ``},
        planned: { type: String, require: false, default: ``}
    },
    options
);

const User = mongoose.model("User", schema);

module.exports = User;
