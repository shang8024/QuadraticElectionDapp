const http = require('http');
const socketIo = require('socket.io');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

// Configure the database to save after each operation and reload from the file
const db = new JsonDB(new Config("userData", true, true, '/'));

// Asynchronous function to ensure the users data path exists or to create it
async function initializeUsers() {
    try {
        // Try to get the data asynchronously
        const users = await db.getData("/users");
        console.log("Users data already initialized:", JSON.stringify(users, null, 2));
    } catch (error) {
        console.log("Data path /users not found, initializing...");
        // If the path doesn't exist, initialize it with an empty object
        await db.push("/users", {});
        console.log("Users initialized.");
    }
}

// Initialize the database before starting the server
initializeUsers().then(() => {
    const server = http.createServer((req, res) => {
        res.end('WebSocket server is running');
    });
    const io = socketIo(server, {
        cors: {
            origin: "*", // Adjust according to your security requirements
            methods: ["GET", "POST"]
        }
    });

    // Socket.io connection event
    io.on('connection', (socket) => {
        //console.log('New client connected');

        // Handle addUser event
        socket.on('addUser', async (userData) => {
            try {
                // Push the new user's data into the database asynchronously
                await db.push(`/users/${userData.username}`, userData.password);
                // Retrieve updated users list and emit to all clients
                const users = await db.getData("/users");
                io.emit('updateUsers', users);
                console.log("Added new user and emitted updated users list.");
            } catch (error) {
                console.error("Error adding new user:", error);
            }
        });

        // Handle request for all users
        socket.on('requestAllUsers', async () => {
            try {
                const users = await db.getData("/users");
                socket.emit('updateUsers', users);
                //console.log("Emitted current users list.");
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    // Start the server
    server.listen(4000, () => {
        console.log('WebSocket server running on port 4000');
    });
}).catch(error => {
    console.error('Failed to initialize the user database:', error);
});
