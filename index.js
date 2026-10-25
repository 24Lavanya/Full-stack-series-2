import express from "express";

const app = express();

app.use(express.json());

let users = [
    { id: 1, name: 'Aman', age: 22 },
    { id: 2, name: 'Rahul', age: 25 }
];

let nextId = 3;

// CREATE: Add a new user
app.post('/users', (req, res) => {
    const { name, age } = req.body;

    const newUser = {
        id: nextId++,
        name,
        age
    };

    users.push(newUser);

    res.status(201).json(newUser);
});

// READ: Get all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// READ: Get a user by ID
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.status(200).json(user);
});

// UPDATE: Update a user
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const { name, age } = req.body;

    user.name = name;
    user.age = age;

    res.status(200).json(user);
});

// DELETE: Delete a user
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const userExists = users.some(user => user.id === id);

    if (!userExists) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    users = users.filter(user => user.id !== id);

    res.status(200).json({
        message: 'User deleted successfully'
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});