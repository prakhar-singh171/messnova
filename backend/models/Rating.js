import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
  time: {
    type: Date,
    default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  }
}, {
  timestamps: true,
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;