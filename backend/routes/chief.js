import express from 'express';
import { addAccountant, getSignatureForUpload, resolveComplaint } from '../controllers/chief.js';

const router = express.Router();

router.post('/add-accountant', addAccountant);
router.get("/get-signature", getSignatureForUpload);
router.post("/resolve-complaint", resolveComplaint);

export default router;