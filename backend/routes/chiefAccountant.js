import express from 'express';
import { changeMenu, uploadNotice, getHostelNameAndCode } from '../controllers/chiefAccountant.js';

const router = express.Router();

router.post('/upload-notice', uploadNotice);
router.put("/change-menu/:day", changeMenu);
router.get("/get-hostel-name-and-code", getHostelNameAndCode);

export default router;
