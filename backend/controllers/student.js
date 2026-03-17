import dotenv from "dotenv";
import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Rating from "../models/Rating.js";

dotenv.config();

const joinHostel = async (req, res, next) => {  
  try {
    const { hostelCode } = req.body;

    const hostel = await Hostel.findOne({ hostelCode });
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    const user = await User.findById(req.user._id);
    if (user.hostel) {
      return res.status(400).json({ success: false, message: "You have already joined a hostel" });
    }

    user.hostel = hostel._id;
    await user.save();

    const accessToken = user.generateAccessToken();
    
    res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    
    return res.json({ hostel: hostel._id, success: true, message: "Hostel joined successfully" });
  } catch (error) {   
    res.status(500).json({ message: "Server error", error });
  }
};

const raiseComplaint = async (req, res, next) => {
  try {
    if(req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: "You are not authorized to raise a complaint" });
    }

    const { title, description, file } = req.body;
    const complaint = await Complaint.create({ title, description, file, hostel: req.user.hostel });
    return res.json({ success: true, message: "Complaint raised successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const likeComplaint = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: "You are not authorized to like a complaint" });
    }
    const { complaintId } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    // Only allow reactions if complaint status is pending
    if (complaint.status !== "pending") {
      return res.status(400).json({ success: false, message: "You can only react to pending complaints" });
    }
    if (complaint.likes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already liked this complaint" });
    }
    // Prevent liking if already disliked
    if (complaint.dislikes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already disliked this complaint. You cannot like it unless you remove your dislike." });
    }
    complaint.likes.push(req.user._id);
    await complaint.save();
    return res.json({ success: true, message: "Complaint liked successfully", updatedComplaint: complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const dislikeComplaint = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: "You are not authorized to dislike a complaint" });
    }
    const { complaintId } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    // Only allow reactions if complaint status is pending
    if (complaint.status !== "pending") {
      return res.status(400).json({ success: false, message: "You can only react to pending complaints" });
    }
    if (complaint.dislikes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already disliked this complaint" });
    }
    // Prevent disliking if already liked
    if (complaint.likes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already liked this complaint. You cannot dislike it unless you remove your like." });
    }
    complaint.dislikes.push(req.user._id);
    await complaint.save();
    return res.status(200).json({ success: true, message: "Complaint disliked successfully", updatedComplaint: complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const submitRating = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: "You are not authorized to submit a rating" });
    }
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Get current Indian time
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    // Compute the start of the day in IST
    nowIST.setHours(0, 0, 0, 0);

    const existingRating = await Rating.findOne({
      user: req.user._id,
      hostel: req.user.hostel,
      time: { $gte: nowIST }
    });
    
    if (existingRating) {
      return res.status(400).json({ success: false, message: "You have already rated this hostel today" });
    }

    // The new rating will use the default "time" field value in IST from the schema
    await Rating.create({ rating, user: req.user._id, hostel: req.user.hostel });
    
    return res.status(201).json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const leaveHostel = async (req, res, next) => {
  try {
    if(req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: "You are not authorized to leave a hostel" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.hostel = null;
    await user.save();
    const accessToken = user.generateAccessToken();
    
    res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    return res.status(200).json({ success: true, message: "Hostel left successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  joinHostel,
  raiseComplaint,
  likeComplaint,
  dislikeComplaint,
  submitRating,
  leaveHostel,
};