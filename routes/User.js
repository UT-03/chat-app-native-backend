const express = require('express');

const { checkContacts, getMessages, sendMessage } = require('../controllers/User');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/check-contacts', checkAuth, checkContacts);

router.get('/messages/:userId', checkAuth, getMessages);

router.post('/send-message', checkAuth, sendMessage);

module.exports = router;