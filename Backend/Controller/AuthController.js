const DeanAndHOD = require("../Schemas/DeanAndHOD")
const Students = require("../Schemas/Students")
const bcrypt = require('bcrypt')
const qrCode = require('qrcode')
const jwt = require('jsonwebtoken')
const GenerateToken = require("../Middleware/GenerateToken")

exports.Signup = async (req, res) => {

    const {name, email,password,confirmPassword, UID , role} = req.body
    if(!name || !email || !password || !confirmPassword || !UID){
        return res.status(400).json({message: "All fields are required"})
    }

    if(password !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"})
    }

    const GenSalt = await bcrypt.genSalt(12)
     const HashedPassword = await bcrypt.hash(password, GenSalt)

     const qr = await qrCode.toDataURL(UID)

     console.log(qr)
    try {
      if(role === "student"){
        const student = await Students.create({
            name,
            email,
            password: HashedPassword,
            confirmPassword: HashedPassword,
            UID, 
            qr
        })
        return res.status(201).json({message: "Student Created Successfully", student , token:GenerateToken(student._id, role)})
      }

      if(role === "DeanAndHOD"){
        const DeanAndHOD = await DeanAndHOD.create({
            name,
            email,
            password: HashedPassword,
            UID
        })
        return res.status(201).json({message: "DeanAndHOD Created Successfully", DeanAndHOD , token:GenerateToken(DeanAndHOD._id, role)})
      }

}catch(err){
    console.log(err)
    return res.status(500).json({message: "Internal Server Error"})
}
}

exports.Login = async (req, res) => {
   const {email, password, role} = req.body
   if(!email || !password){
       return res.status(400).json({message: "All fields are required"})
   }

   try {
    if(role === "student"){
        const student = await Students.findOne({email})
        if(!student){
            return res.status(404).json({message: "User not found"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, student.password)
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid Password"})
        }
        return res.status(200).json({message: "Login successful", student , token:GenerateToken(student._id, role)})
    }
    if(role === "DeanAndHOD"){
        const DeanAndHOD = await DeanAndHOD.findOne({email})
        if(!DeanAndHOD){
            return res.status(404).json({message: "User not found"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, DeanAndHOD.password)
        if(!isPasswordCorrect){
            
            return res.status(401).json({message: "Invalid Password"})
        }
        return res.status(200).json({message: "Login successful", DeanAndHOD , token:GenerateToken(DeanAndHOD._id, role)})
    }
}
catch(err){
    console.log(err)
    return res.status(500).json({message: "Internal Server Error"})

}

}