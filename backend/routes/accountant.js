import express from 'express';
import { addExpense } from '../controllers/accountant.js';

const router = express.Router();

router.post('/add-expense', addExpense);

export default router;