const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = 3000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'yourUsername',
  host: 'localhost',
  database: 'yourDatabaseName',
  password: 'yourPassword',
  port: 5432,
});

// Express application setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (res.rows.length > 0) {
      const user = res.rows[0];
      // Password check (in real-world use bcrypt.compare)
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect username.' });
    }
  } catch (err) {
    return done(err);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (res.rows.length > 0) {
      const user = res.rows[0];
      done(null, user);
    } else {
      done(new Error('User not found.'));
    }
  } catch (err) {
    done(err);
  }
});

// Routes
app.get('/', (req, res) => res.send('Election Smart Contract Backend Running'));

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
