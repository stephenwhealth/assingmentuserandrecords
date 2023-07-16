require('./config/stephenDB')

const express = require('express')
const port = 2355

const app = express()
app.use(express.json())

const router = require('./router/userrouter')

const recordrouter = require('./router/recordrouter')

app.use('/api', router)

app.use('/api', recordrouter)


app.listen(port, ()=>{
    console.log(`app is connected to port: ${port}`)
})