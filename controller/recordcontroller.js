const usermodel = require('../model/usermodel')
const recordmodel = require('../model/recordsmodel')

// creating a record

exports.newrecord= async(req,res)=>{
    try {
        const {Age, Sex} = req.body

        const user = await usermodel.findById(req.params.id)

        if(!user.token){
            return res.status(404).json({
                message: 'Only loged in users can have access to create records'
            })
        }

        const body = new recordmodel({
            Age,
            Sex
        })

        await body.save()

        return res.status(201).json({
            message: "record created successfully",
            data: body
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// read all records

exports.readall= async(req,res)=>{
    try {
        const {email} = req.body
        const findall= await recordmodel.find()
        const user = await usermodel.findOne({email})
        if(!user.token){
            res.status(400).json({
                message: 'not authorized'
            })
        }else{
            res.status(200).json({
                message: 'all records',
                data: findall
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// deleting records

exports.deleterec = async(req,res)=>{
    try {
        const {email} = req.body

        const user = await usermodel.findOne({email})

        if(!user.token){
            res.status(400).json({
                message: 'not authorized'
            })
        }else{

        const deleted = await recordmodel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: 'record deleted successfully',
            data: deleted
        })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// updating a record

exports.updaterec = async(req,res)=>{
    try {
        const {token} = req.params

        const user = await usermodel.findOne({token})

        if(!user){
            res.status(400).json({
                message: 'not authorized'
            })
        }else{
            const {Age, Sex} = req.body

            const id = req.params.id

            const body={
                Age: Age || user.Age,
                Sex: Sex || user.Sex
            }

        const updated = await recordmodel.findByIdAndUpdate(id, body,{new:true})

        res.status(200).json({
            message: 'record updated successfully',
            data: updated
        })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}