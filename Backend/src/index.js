import cors from 'cors';
import express from 'express';
import router from './routes/index.js';
import { dbConnection } from './database/db.js';

const app = express();
const PORT = process.env.PORT || 1500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Triggering database connection
dbConnection.getConnect();

// ROUTER
app.use(router);

app.listen(PORT, () => console.log(`Server connected at http://localhost:${PORT}`));