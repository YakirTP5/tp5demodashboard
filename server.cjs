const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());

// MongoDB connection
const client = new MongoClient('mongodb://localhost:27017/');
let db;

client.connect().then(() => {
  db = client.db('mock_data_db');
  console.log('Connected to MongoDB');
});

// Endpoints
app.get('/api/tasks', async (req, res) => {
  const tasks = await db.collection('Tasks').find({}, { projection: { logs: 0 } }).toArray();
  res.json(tasks);
});

app.get('/api/workflows', async (req, res) => {
  const workflows = await db.collection('Workflows').find({}, { projection: { logs: 0 } }).toArray();
  res.json(workflows);
});

app.get('/api/sessions', async (req, res) => {
  const sessions = await db.collection('Sessions').find({}, { projection: { logs: 0 } }).toArray();
  res.json(sessions);
});

app.get('/api/steps', async (req, res) => {
  const steps = await db.collection('Steps').find().toArray();
  res.json(steps);
});

app.get('/api/actions', async (req, res) => {
  const actions = await db.collection('Actions').find().toArray();
  res.json(actions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 