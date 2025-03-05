const express = require('express');
const { AdminLogin } = require('../Controller/AdminController');
const { AdminSignup } = require('../Controller/AdminController');

const router = express.Router();

router.post('/login', AdminLogin);
router.post('/signup', AdminSignup);

module.exports = router;