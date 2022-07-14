const express = require('express');

const { checkContacts } = require('../controllers/User');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.post('/check-contacts', checkAuth, checkContacts);

module.exports = router;