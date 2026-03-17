import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Complaint from "../models/Complaint.js";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRETE,
  secure : true,
});

const addAccountant = async (req, res, next) => {

    if(req.user.role !== "chiefWarden")
        return res.status(401).json({success:false, message:"Unauthorized Access."});

    const { username, email, password, hostel } = req.body;
    const emailCheck = await User.findOne({ email });

    if(emailCheck)
        return res.status(409).json({success:false, message:"Email already exists."});
   
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password:hashedPassword,
      role: "accountant",
      hostel,
    });

    return res.status(201).json({success:true, message:"Accountant added successfully."});
  };


  const getSignatureForUpload = async (req, res, next) => {
    try {
      const timestamp = Math.round((new Date).getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request({
        timestamp,
      },process.env.CLOUDINARY_API_SECRETE);
      // console.log("Timestamp:", timestamp);
      return res.json({timestamp,signature});
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  const resolveComplaint = async (req, res) => {
    if(req.user.role !== "chiefWarden")
        return res.status(401).json({success:false, message:"Unauthorized Access."});

    const { complaintId } = req.body;
    const complaint = await Complaint.findById(complaintId);

    if(!complaint)
        return res.status(404).json({success:false, message:"Complaint not found."});

    if(complaint.status !== "pending")
        return res.status(400).json({success:false, message:"Complaint is not pending."});

    complaint.status = "resolved";
    await complaint.save();

    return res.status(200).json({success:true, message:"Complaint resolved successfully.", updatedComplaint: complaint});
  };


export {
    addAccountant,
    getSignatureForUpload,
    resolveComplaint,
};