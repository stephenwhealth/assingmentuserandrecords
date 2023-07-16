const express= require('express')
const router = express.Router()
const imported = require('../controller/recordcontroller')

router.post('/createrecord/:id', imported.newrecord)
router.get('/allrecords', imported.readall)
router.delete('/delete/:id', imported.deleterec)
router.put('/update/:token/:id', imported.updaterec)

module.exports = router