const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nikhil@2002',
    database: 'application_db'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

// Create a new user
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    db.query(sql, [name, email, age], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Failed to create user' });
        } else {
            res.status(201).json({ message: 'User created successfully', id: result.insertId });
        }
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Failed to fetch users' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Get a single user by id
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Failed to fetch user' });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Update a user by id
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, age } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    db.query(sql, [name, email, age, userId], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Failed to update user' });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    });
});

// Delete a user by id
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ message: 'Failed to delete user' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
