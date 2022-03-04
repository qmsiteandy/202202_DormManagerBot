const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},  //姓名
    userID: { type: String, required: true, unique: true},  //學號
    dormID: { type: String, required: true},  //宿舍棟號
    floorID: { type: String, required: true},  //樓層
    roomID: { type: String, required: true},  //幾房
    lineUID: { type: String, required: true, unique: true}, //LINE UID
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;