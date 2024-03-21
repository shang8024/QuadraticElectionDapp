const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const cors = require('cors');


app.use(cors());

app.use(bodyParser.json());

const users = {};

app.post('/signup', (req, res) => {
    const { username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({ error: 'Both username and password are required :)' });
    }
    if (users[username]) {
        return res.status(409).json({ error: 'Username already exists! Sorry :('});
    }

    users[username] = password;

    return res.status(200).json({ message: 'User created successfully.'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})



