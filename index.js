const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // For loading environment variables

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Nikhil@2002',
    database: process.env.DB_NAME || 'application_db',
    multipleStatements: false // Prevent multiple statements in a single query
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// API Routes

// Create a new user
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    db.query(sql, [name, email, age], (err, result) => {
        if (err) {
            console.error('Error creating user:', err.stack);
            return res.status(500).json({ message: 'Failed to create user' });
        }
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.stack);
            return res.status(500).json({ message: 'Failed to fetch users' });
        }
        res.status(200).json(results);
    });
});

// Get a single user by id
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error fetching user:', err.stack);
            return res.status(500).json({ message: 'Failed to fetch user' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Update a user by id
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, age } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    db.query(sql, [name, email, age, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err.stack);
            return res.status(500).json({ message: 'Failed to update user' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete a user by id
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err.stack);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
