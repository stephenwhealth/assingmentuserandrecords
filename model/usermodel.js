const mongoose= require('mongoose')

const userinput = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    isverified:{
        type: Boolean,
        default: false
    },
    token:{
        type:String
    }
},{timestamps: true})

const userSchema = mongoose.model('assignment user', userinput)

module.exports = userSchema