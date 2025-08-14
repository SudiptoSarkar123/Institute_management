const express = require('express')
const router = express.Router();


const instituteController = require('../controller/instute.controller')

router.post('/register',instituteController.register);
router.post('/add-roll',instituteController.createRoll);
router.post('/login',instituteController.login);


module.exports = router ; 