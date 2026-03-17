import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  meals: {
    breakfast: { type: String },
    lunch: { type: String },
    snacks: { type: String },
    dinner: { type: String },
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;