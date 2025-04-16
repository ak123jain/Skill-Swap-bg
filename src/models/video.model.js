import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    videoUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // sender
    sharedWith: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // receiver
    createdAt: { type: Date, default: Date.now }
});

export const Video = mongoose.model('Video', videoSchema);