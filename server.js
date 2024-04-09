const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Middleware to parse JSON bodies

// Temporary storage for example purposes
const users = {}; // username as key, password hash as value
const SECRET_KEY = "secret"; // Ideally, use an environment variable in production for the secret

// Handle signup requests
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log("Received signup request for username:", username);

  // Check if username already exists
  if (users[username]) {
    return res.status(409).json({ error: 'Username already exists! Sorry :('});
  }

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password are required :)' });
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = hashedPassword;
  
  // Respond with success message
  res.status(201).json({ message: 'User created successfully.' });
});

// Handle login requests
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users[username];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  // Generate and return a JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token });
});
app.use(express.static('./client/build'));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
