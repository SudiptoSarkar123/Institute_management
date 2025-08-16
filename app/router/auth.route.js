const express = require('express')
const router = express.Router();


const instituteController = require('../controller/instute.controller')
const authCheck = require('../middleware/authCheck')
const upload = require('../middleware/uploads')
const adminsOnly = require('../middleware/adminsOnly')

router.post('/register',instituteController.register);
router.post('/add-roll',instituteController.createRoll);
router.post('/login',instituteController.login);
router.get('/profile',authCheck,instituteController.getProfile);
router.put('/profile',upload.single('profileImage'),authCheck,instituteController.updateProfile)
router.get('/users',authCheck,adminsOnly,instituteController.getAllUsers)


module.exports = router ; 