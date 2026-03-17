import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import allowedOrigin from './config/allowedOrigin.js';
import authRoutes from './routes/auth.js'
import chiefRoutes from './routes/chief.js'
import studentRoutes from './routes/student.js'
import generalRoutes from './routes/general.js'
import chiefAccountantRoutes from './routes/chiefAccountant.js'
import accountantRoutes from "./routes/accountant.js";
import verifyToken from "./middleware/authMiddleware.js";

const app = express();

import dotenv from "dotenv";
dotenv.config();

const corsOptions ={
  origin: allowedOrigin, 
  credentials:true,            
  optionSuccessStatus:200,
  sameSite:'none',
  secure:true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth-check", verifyToken, (req, res) => {
  res.status(200).json({ isAuthenticated: true, user:req.user });
});

app.use('/auth', authRoutes);
app.use('/chief-warden', verifyToken, chiefRoutes);
app.use('/chief-warden-accountant', verifyToken, chiefAccountantRoutes);
app.use('/student', verifyToken, studentRoutes);
app.use('/accountant', verifyToken, accountantRoutes);
app.use('/general', verifyToken, generalRoutes);

mongoose
  .connect( process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(8080, () =>
  console.log(`Server started on 8080`)
); 