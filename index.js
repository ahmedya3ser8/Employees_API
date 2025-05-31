import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import employeeRouter from './routes/employee.route.js';

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('MongoDB server connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
})

app.use('/api/employees', employeeRouter)

app.listen(process.env.PORT, '127.0.0.1', () => {
  console.log('server running http://localhost:8000');
})
