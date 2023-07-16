const express= require('express')
const router = express.Router()
const imported = require('../controller/usercontroller')

router.post('/signup', imported.signup)
router.post('/verify/:token', imported.verifyEmail)
router.post('/reverify', imported.resendverification)
router.post('/login', imported.signin)
router.get('/signout', imported.signOut)

module.exports= router