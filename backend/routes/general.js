import express from 'express';
import { messMenu, getNotices, getPendingComplaints, getResolvedComplaints, getAverageRating, getWeeklyRatings, getHostelName, uploadProfileImage, dailyExpense, monthlyExpense } from '../controllers/general.js';

const router = express.Router();

router.get("/mess-menu", messMenu);
router.get("/get-notices", getNotices);
router.get("/get-pending-complaints", getPendingComplaints);
router.get("/get-resolved-complaints", getResolvedComplaints);
router.get("/get-average-rating", getAverageRating);
router.get("/get-weekly-ratings", getWeeklyRatings);
router.get("/get-hostel-name", getHostelName);
router.get("/daily-expense", dailyExpense);
router.get("/monthly-expense", monthlyExpense);
router.post("/upload-profile-image", uploadProfileImage);

export default router;