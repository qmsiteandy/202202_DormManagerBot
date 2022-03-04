const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},  //姓名
    userID: { type: String, required: true, unique: true},  //學號
    roomID: { type: String, required: true},  //寢室
    lineUID: { type: String, required: true, unique: true}, //LINE UID
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;