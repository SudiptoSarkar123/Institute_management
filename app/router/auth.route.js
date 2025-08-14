const express = require('express')
const router = express.Router();


const instituteController = require('../controller/instute.controller')
const authCheck = require('../middleware/authCheck')

router.post('/register',instituteController.register);
router.post('/add-roll',instituteController.createRoll);
router.post('/login',instituteController.login);
router.get('/profile',authCheck,instituteController.getProfile);



module.exports = router ; 