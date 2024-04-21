const express = require('express');
const session = require('express-session');
const Redis = require('redis');
const connectRedis = require('connect-redis');

// First, define the Redis client
const redisClient = Redis.createClient({
    host: 'localhost',
    port: 6379,
    legacyMode: true
});
redisClient.connect().catch(err => console.error('Redis Client Connection Error', err));

// Then, define the RedisStore using the new keyword with connectRedis
const RedisStore = connectRedis.default;
const redisStore = new RedisStore({ client: redisClient });

// Now, use redisStore in your session middleware configuration
const sessionMiddleware = session({
    store: redisStore,
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // should be true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
});

const app = express();
app.use(sessionMiddleware);

app.get('/', (req, res) => {
    res.send('Session ID: ' + req.session.id);
});

const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

server.on('error', error => console.log('Server Error:', error));
