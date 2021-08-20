const Like = require('../models/like');

module.exports = {
    create: async data => {
        let t = new Like({
            date: data.date,
            userId: data.userId,
            postId: data.postId
        });
        t = await t.save();
        return t ? t : false;
    },
    list: async () => await Like.find({}),
    getByPost: async id => await Like.find({postId: id}).populate('userId').sort({ date: -1 }),
    getByUser: async id => await Like.find({userId: id}).populate('postId').sort({ date: -1 }),
    check: async data => await Like.find({ $and: [{userId: data.userId}, {postId: data.postId}]}),
    delete: async id => {
        let t = await Like.findByIdAndDelete(id);
        return t ? t : false;
    },
    //code responsible for deleting posts
    deleteByPost: async id => {
        let t = await Like.deleteMany({postId: id});
        return t ? t : false;
    },
    //code in charge of deleting posts by id and user id
    deleteByPostAndUser: async data => {
        let t = await Like.deleteMany({postId: data.postId, userId: data.userId});
        return t ? t : false;
    }
}