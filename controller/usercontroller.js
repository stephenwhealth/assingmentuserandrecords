require('dotenv').config()
const user = require('../model/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')



const sender = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });


// SIGN UP CODE

exports.signup = async(req,res) => {
     try {
        const{name, email, password, token} = req.body

        const ifmail = await user.findOne({email})

        if(ifmail){
            console.log('email already registered')
        }else{
            // salt the password
            const salt = await bcrypt.genSalt(10)
            // hash password
            const hashed = await bcrypt.hash(password, salt)

      
            const newtoken = await jwt.sign({email}, process.env.KEY_SECRET, {expiresIn: '10m'})

            // creating a user
        const saveddata = new user ({
            name,
            email,
            password: hashed,
            token: newtoken
        })


        // sending verification
        const baseUrl = process.env.URL
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "ACCOUNT VERIFICATION",
            html: `Click on this link to verify your email: <a href="${baseUrl}/create/verify-email/${ token }">Verify Email</a>`,
        };

        await sender.sendMail(mailOptions);

        const saveduser = await saveddata.save()

        res.status(201).json({
            message: `user created successfully, we await your verification from your email: ${saveduser.email}`,
            data: saveduser,
            token
        })

        }   
     } catch (error) {
        res.status(500).json({
            message: error.message
        })
     }
}

// verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // verify the token
        const { email } = jwt.verify( token, process.env.KEY_SECRET );

        const oneuser = await user.findOne( { email } );

        oneuser.isverified = true

        // save the updated data
        await oneuser.save();

        res.status( 200 ).json( {
            message: "User verified successfully",
            data: oneuser,
        })

        // res.status( 200 ).redirect( `${ process.env.BASE_URL }/login` );

    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}

// resending of verification mail

exports.resendverification = async(req,res)=>{
    try {
        const {email} =req.body

        const ifemail = await user.findOne({email})

        if(!ifemail){
            res.status(404).json({
                message: 'email not found'
            })
        }
        const token = await jwt.sign({email}, process.env.KEY_SECRET, {expiresIn: '1d'})

        // send verification email
        const baseUrl = process.env.URL
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: ifemail.email,
            subject: "Email Verification",
            html: `Please click on the link to verify your email: <a href="${baseUrl}/reverify/verify-email/${ token }">Verify Email</a>`,
        };

        await sender.sendMail( mailOptions );

        res.status( 200 ).json( {
            message: `Verification email sent successfully to your email: ${ifemail.email}`
        } );

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// sign in

exports.signin= async(req,res)=>{
    try {
        const {email, password, token} = req.body

        const logincheck = await user.findOne({email})

        // token creating
        const newtoken = await jwt.sign({email}, process.env.KEY_SECRET, {expiresIn: '10m'})

        logincheck.token = newtoken

        await logincheck.save()


        if(!logincheck || !logincheck.isverified){
            return res.status(404).json({message:'you dont have an account or you have not verified your email'})
        }

        const checkpass = await bcrypt.compare(password, logincheck.password)

        if(!checkpass){
            return res.status(400).json({message: 'incorrect password'})
        }else{
            return res.status(200).json({
                message: 'you have successfully loged in',
                token
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// sign out

exports.signOut = async (req, res) => {
    try {
        const {email} = req.body

        // find the user by the email
        const finduser = await user.findOne( { email } )

        if ( !finduser ) {
            return res.status( 401 ).json( {
                message: "Invalid email"
            })
        }else{
        // clear the token
        finduser.token = ''
        
        // save the data
        await finduser.save()

        return res.status( 200 ).json( {
            message: "User signed out successfully"
        })
    }
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        })
    }
}