import mongoose from 'mongoose';

const HostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
    trim: true,
  },
  hostelCode: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  accountantId: {
    type: String,
    trim: true,
  },
  wardenId: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Hostel = mongoose.model('Hostel', HostelSchema);

export default Hostel;