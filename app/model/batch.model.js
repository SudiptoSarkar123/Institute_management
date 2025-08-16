const { default: mongoose } = require("mongoose");

const batchSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  name: {
    type: String,
    required: true,
  }, // e.g., "Batch A - 2025"
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  teacher:{type: mongoose.Schema.Types.ObjectId, ref:"User"}
});

module.exports = mongoose.model("Batch", batchSchema);
