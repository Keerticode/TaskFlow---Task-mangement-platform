import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

dotenv.config({
    path: './.env'
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRouter);

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});