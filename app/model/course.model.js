const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationWeeks: Number,
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
