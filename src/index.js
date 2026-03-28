import express from 'express';
import 'dotenv/config'
import { matchRouter } from './routes/matches.js';

const app = express();
const port = 8000 || process.env.port;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello from Express server");
})

app.use('/matches', matchRouter);

app.listen(port, () => {
  console.log("Server is running");
})