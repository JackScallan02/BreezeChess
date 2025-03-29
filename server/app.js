import express from 'express';
import cors from 'cors';

const app = express();

app.options('*', cors()); // Handle preflight requests
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

export default app;
