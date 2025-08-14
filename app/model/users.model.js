const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    role:{type:mongoose.Schema.Types.ObjectId, ref:"Role",required:true},
    contact:String,
    dateOfBirh:Date,
    assignedCourses:[{type:mongoose.Schema.Types.ObjectId, ref:'Course'}],
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

module.exports = mongoose.model('User',userSchema);