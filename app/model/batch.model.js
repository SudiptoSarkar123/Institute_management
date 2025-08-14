const { default: mongoose } = require("mongoose");

const batchSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  name: String, // e.g., "Batch A - 2025"
  startDate: Date,
  endDate: Date,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  teacher:{type: mongoose.Schema.Types.ObjectId, ref:"User"}
});

module.exports = mongoose.model("Batch", batchSchema);
