const Admin = require("../Schemas/Admin")

exports.AdminSignup = async (req, res) => {
    const {name, email,password,confirmPassword} = req.body 
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({message: "All fields are required"})
    }
    if(password !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"})
    }
    const GenSalt = await bcrypt.genSalt(12)
    const HashedPassword = await bcrypt.hash(password, GenSalt)
    try {
        const admin = await Admin.create({
            name,
            email,
            password: HashedPassword,
            confirmPassword: HashedPassword,
        })
        const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET)    
        return res.status(201).json({message: "Admin Created Successfully", admin , token })
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}   

exports.AdminLogin = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"})
    }
    try {
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        const validPassword = await bcrypt.compare(password, admin.password)
        if(!validPassword){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET)
        return res.status(200).json({message: "Login Successful", admin,token})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}