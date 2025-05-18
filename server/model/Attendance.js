import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true,
    index: true,
  },
  records: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
      },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Attendance', attendanceSchema);
