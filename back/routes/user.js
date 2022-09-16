const express = require('express');
const router = express.Router();
const reqmax = require("../middleware/limiter")

const userControl = require('../controllers/user');

router.post('/signup', userControl.create_user);
router.post('/login', reqmax.limiter, userControl.connect_user);

module.exports = router;