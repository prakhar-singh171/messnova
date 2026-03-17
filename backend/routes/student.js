import express from 'express';
import { joinHostel, raiseComplaint, likeComplaint, dislikeComplaint, submitRating, leaveHostel } from '../controllers/student.js';

const router = express.Router();

router.post("/join-hostel", joinHostel);
router.post("/raise-complaint", raiseComplaint);
router.post("/like-complaint", likeComplaint);
router.post("/dislike-complaint", dislikeComplaint);
router.post("/submit-rating", submitRating);
router.post("/leave-hostel", leaveHostel);

export default router;