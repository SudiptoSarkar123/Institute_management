const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    batch:{type:mongoose.Schema.Types.ObjectId, ref:"Batch",requried:true},
    title:String,
    date:Date,
    maxMarks:Number,
    results:[
        {
            student:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            marksObtained:Number,

        }
    ]
});

module.exports = mongoose.model("Exam",examSchema);

