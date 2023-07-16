require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.DATABASE

mongoose.connect(url).then(()=>{
    console.log('database is active')
})