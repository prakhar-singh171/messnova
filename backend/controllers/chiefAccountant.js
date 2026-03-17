import dotenv from "dotenv";
import Menu from "../models/Menu.js";
import Notice from "../models/Notice.js";
import Hostel from "../models/Hostel.js";

dotenv.config();

  const changeMenu = async (req, res) => {
    console.log(req);
    if(!(req.user.role === "chiefWarden" || req.user.role === "accountant"))
        return res.status(401).json({success:false, message:"Unauthorized Access."});

    const { day } = req.params;
    const { mealType, value } = req.body;
  
    try {
      const updatedMenu = await Menu.findOneAndUpdate(
        { 
          day,
          hostel: req.user.hostel
        },
        { $set: { [`meals.${mealType}`]: value } },
        { new: true }
      );
      
      if (updatedMenu) {
        res.json(updatedMenu);
      } else {
        res.status(404).json({ error: "Menu not found for the specified day" });
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const uploadNotice = async (req, res, next) => {
    try {
      if(!(req.user.role === "chiefWarden" || req.user.role === "accountant"))
        return res.status(401).json({success:false, message:"Unauthorized Access."});
      const { title, description, file } = req.body;
      const hostel = req.user.hostel;
      const notice = await Notice.create({ title, description, file, hostel });
      return res.json( {success:true, message:"Notice added successfully."} );
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  const getHostelNameAndCode = async (req, res) => {
    if(!(req.user.role === "chiefWarden" || req.user.role === "accountant"))
        return res.status(401).json({success:false, message:"Unauthorized Access."});

    const hostel = await Hostel.findById(req.user.hostel);
    if(!hostel)
        return res.status(404).json({success:false, message:"Hostel not found."});

    return res.status(200).json({success:true, hostelName: hostel.hostelName, hostelCode: hostel.hostelCode});
  }

export {
    changeMenu,
    uploadNotice,
    getHostelNameAndCode,
};