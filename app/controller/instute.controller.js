const User = require('../model/users.model')
const Role = require('../model/role.model')
const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
class instituteController {
    async register(req, res) {
        const v = new Validator(req.body, {
            name: 'required|string',
            email: 'required|email',
            password: 'required|string|minLength:6',
            role: 'required|string'
        });
        const matched = await v.check();
        if (!matched) {
            return res.status(422).json(v.errors);
        }
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    message: 'All filds are required...'
                })
            }
            const ifExsist = await User.findOne({ email });
            if (ifExsist) {
                return res.status(400).json({
                    message: 'User alrady exists...'
                })
            }
            const newUser = new User({
                name, email, password, role
            });

         const data =  await newUser.save()

            return res.status(400).json({
                message:`New user ${name} is created successfully `,
                newUser:data
            })

        } catch (error) {
            return res.status(400).json({
                message:'Failed to register user...'
            })
        }
    }

    async createRoll(req,res){
        try {
            const {name,permissions} = req.body ;
            if(!name || !permissions ){
                return res.status(400).json({
                    message:`All filds are required...`
                })
            }
            const isNew = await Role.findOne({name:name.toUpperCase()});
            if(isNew){
                return res.status(400).json({
                    message:'Roll alrady exists...'
                })
            }
            const newRoll = new Role({
                name: name.toUpperCase(),
                permissions
            })
            await newRoll.save()
            return res.status(200).json({
                message:`New roll created successfully`,
                data:newRoll
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message:"Failed to add roll"
            })
        }
    }

    async login(req,res){
        try {
            const {email,password} = req.body;
            if(!email || !password){
                return res.status(400).json({
                    message:`All filds are required...`
                })
            }
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(400).json({
                    message:`User not found`
                })
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({
                    message:`Password does not match`
                })
            }
            const payload = {
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            } 
            const token = jwt.sign(payload,process.env.JWT_SECRET);
            if(user){
                return res.status(200).json({
                    message:`User logged in successfully`,
                    user:user,
                    token:token
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message:"Failed to login"
            })
        }
    }

    async getProfile(req,res){
        try {
            const user = await User.findById(req.user.id).select('-password');
            if(!user){
                return res.status(400).json({
                    message:`User not found`
                })
            }
            return res.status(200).json({
                message:`User profile`,
                user:user
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message:"Failed to get profile"
            })
        }
    }
}


module.exports = new instituteController()