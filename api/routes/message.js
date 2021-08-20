const router = require('express').Router();
const conversationManager = require('../managers/conversation');
const messageManager = require('../managers/message');
const moment = require('moment');

router.post('/create', async (req, res) => {
    try {
        let conversation = await conversationManager.create(req.body);
        return res.status(200).send(conversation);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/all/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        let conversations = await conversationManager.getAll(userId);
        return res.status(200).send(conversations);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const t = await messageManager.getByConversationId(conversationId);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;