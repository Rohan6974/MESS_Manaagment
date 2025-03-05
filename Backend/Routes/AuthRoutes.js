const  express = require('express');
const { Signup, Login } = require('../Controller/AuthController');


const router  = express.Router()

router.post("/signup", Signup)
router.post("/login",Login)

module.exports = router