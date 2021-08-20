const router = require('express').Router();
const postManager = require('../managers/post');
const likeManager = require('../managers/like');
const dislikeManager = require('../managers/dislike');

router.get('/:id', async (req, res) => {
    try {
        const t = await postManager.get(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const t = await postManager.getByUserId(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const t = await postManager.create(req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/all', async (req, res) => {
    try {
        const t = await postManager.list(req.body.keyword || "", req.body.userId || null);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/top', async (req, res) => {
    try {
        const t = await postManager.top();
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/:id', async (req, res) => {
    try {
        const t = await postManager.update(req.params.id, { ...req.body });
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await likeManager.deleteByPost(id);
        await dislikeManager.deleteByPost(id);
        const r = await postManager.delete(id);
        return res.status(200).send(r);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;