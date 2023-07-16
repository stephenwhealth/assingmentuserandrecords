const mongoose= require('mongoose')

const userinput = new mongoose.Schema({
    Age:{
        type: String,
        required: true
    },
    Sex:{
        type: String,
        required: [true, "sex is required"]
    }
},{timestamps: true})

const recordsSchema = mongoose.model('assignment records', userinput)

module.exports = recordsSchema