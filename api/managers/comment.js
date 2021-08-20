const Comment = require('../models/comment');

module.exports = {
    create: async data => {
        let t = new Comment({
            date: data.date,
            text: data.text,
            userId: data.userId,
            postId: data.postId
        });
        t = await t.save();
        return t ? t : false;
    },
    list: async () => await Comment.find({}),
    getByPost: async id => await Comment.find({postId: id}).populate('userId').sort({ date: -1 }),
    getByUser: async id => await Comment.find({userId: id}).populate('postId').sort({ date: -1 }),
    delete: async id => {
        let t = await Comment.findByIdAndDelete(id);
        return t ? t : false;
    },
    deleteByPost: async id => {
        let t = await Comment.deleteMany({postId: id});
        return t ? t : false;
    },
    deleteByPostAndUser: async data => {
        let t = await Comment.deleteMany({postId: data.postId, userId: data.userId});
        return t ? t : false;
    }
}