import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});