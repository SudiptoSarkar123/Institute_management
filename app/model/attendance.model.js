const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    batch: {type:mongoose.Schema.Types.ObjectId, ref:"Batch", required:true},
    date:{type:Date, required:true},
    recordes:[
        {
            student:{ type:mongoose.Schema.Types.ObjectId, ref:"User"},
            status:{type:String,enum:["present","absent","late"], default:"present"}
        }
    ]
})

module.exports = mongoose.model('Attendance',attendanceSchema)