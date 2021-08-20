const mongoose = require("mongoose");

const options = {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
};

const schema = new mongoose.Schema(
    {
        date: {type: Date, default: Date.now()},
        text: {type: String, required: true, default: ``},
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    options
);

const Comment = mongoose.model("Comment", schema);

module.exports = Comment;
