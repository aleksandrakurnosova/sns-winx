//server.js
import 'dotenv/config';

import { log } from 'console';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import connectDB from './config/db.js';
const app = express();

// - db connect
await connectDB();

import users from './routes/api/users.js';
import posts from './routes/api/posts.js';

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

app.use('/api/users', users);
app.use('/api/posts', posts);

//server settings
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// - listen
app.listen(port, () => {
  log(`Server running at http://localhost:${port}/`);
});