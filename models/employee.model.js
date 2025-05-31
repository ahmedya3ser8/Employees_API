import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  empName: {
    type: String,
    required: true
  },
  empEmail: {
    type: String,
    required: true,
    unique: true
  },
  empAddress: {
    type: String,
    required: true
  },
  empPhone: {
    type: String,
    required: true
  }
})

export default mongoose.model('Employee', employeesSchema);
