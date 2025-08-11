const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model('User',userSchema);