const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const Redis = require('redis');
const connectRedis = require('connect-redis');

const redisClient = Redis.createClient({
    host: 'localhost',
    port: 6379,
    legacyMode: true
});

redisClient.connect().catch(err => console.error('Redis Client Connection Error', err));

const RedisStore = connectRedis.default;
const redisStore = new RedisStore({ client: redisClient });

const sessionMiddleware = session({
    store: redisStore,
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // should be true if HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:4000", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const db = new JsonDB(new Config("userData", true, true, '/'));

async function initializeUsers() {
    try {
        await db.getData("/users");
    } catch (error) {
        await db.push("/users", {});
    }
}

initializeUsers().then(() => {
    app.get('/', (req, res) => {
        res.send('Server is running');
    });

    io.on('connection', (socket) => {
        const session = socket.request.session;
        
        socket.on('login', async (credentials) => {
            const { username, password } = credentials;
            try {
                const user = await db.getData(`/users/${username}`);
                if (user && user.password === password) {
                    session.username = username; // Save username to session
                    session.save(); // Save the session
                    socket.emit('loginSuccess', { message: 'Login successful', username });
                } else {
                    socket.emit('loginError', { message: 'Login failed' });
                }
            } catch (error) {
                socket.emit('loginError', { message: 'User not found' });
            }
        });
        
    
        // Ensure all users are loaded on server start and when a new user logs in
        socket.on('requestAllUsers', async () => {
            const users = await db.getData("/users");
            io.emit('updateUsers', users);
        });

        socket.on('updateUserAccount', async (data) => {
            const { username, account } = data;
            try {
                // Check if the user exists before attempting to update
                const userExists = await db.exists(`/users/${username}`);
                if (userExists) {
                    // Update the user's account address in the database
                    await db.push(`/users/${username}/account`, account, false);
                    console.log(`Account updated for ${username}: ${account}`);
                    io.emit('updateUsers', await db.getData("/users"));
                } else {
                    console.error(`No user found with username: ${username}`);
                }
            } catch (error) {
                console.error('Error updating user account:', error);
            }
        });
        

        socket.on('addUser', async (userData) => {
            await db.push(`/users/${userData.username}`, { password: userData.password, whitelisted: false, voter: false });
            const users = await db.getData("/users");
            io.emit('updateUsers', users);
        });
    
        socket.on('updateList', async (data) => {
            // Update user properties based on feature requested
            await db.push(`/users/${data.username}/${data.listName}`, true, false);
            const users = await db.getData("/users");
            io.emit('updateUsers', users); // Emit to all clients
        });

        socket.on('requestWhitelist', async (username) => {
            await db.push(`/users/${username}/whitelisted`, true, false); // Do not overwrite the entire user object
            const users = await db.getData("/users");
            io.emit('updateUsers', users);
        });

        socket.on('requestNFT', async (username) => {
            await db.push(`/users/${username}/voter`, true, false); // Do not overwrite the entire user object
            const users = await db.getData("/users");
            io.emit('updateUsers', users);
        });
    });

    server.listen(4000, () => console.log('WebSocket server running on port 4000'));
});
