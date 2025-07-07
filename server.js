const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/ecomdb')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Example route
app.get('/api/hello', (req, res) => {
  res.send('Hello from backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
