import mongoose from 'mongoose';


const sessionSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Booker
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver
  topic: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Session = mongoose.model('Session', sessionSchema);


