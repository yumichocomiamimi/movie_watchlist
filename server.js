import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './user.js';
import { movieOperations } from './database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from frontend

// Serve static files
app.use(express.static(__dirname));

// Initialize SQLite database (tables are created automatically)
console.log('SQLite database initialized');

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Search for a movie by title (partial match, case-insensitive, for autocomplete)
app.get('/movies/search', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required.' });
    }
    try {
        const movies = movieOperations.searchByTitle(title);
        if (movies.length === 0) {
            return res.status(404).json({ error: 'Movie not found.' });
        }
        res.json(movies);
    } catch (err) {
        console.error('Error searching for movie:', err);
        res.status(500).json({ error: 'Error searching for movie.' });
    }
});

// Get all movies
app.get('/movies', async (_req, res) => {
    try {
        const movies = movieOperations.getAll();
        res.json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ error: 'Failed to fetch movies.' });
    }
});

// Add a new movie
app.post('/movies', async (req, res) => {
    try {
        if (!req.body || !req.body.title) {
            return res.status(400).json({ error: 'Movie title is required.' });
        }
        const movie = movieOperations.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        console.error('Error adding movie:', err);
        res.status(400).json({ error: 'Failed to add movie.' });
    }
});

// Update poster
app.patch('/movies/:id/poster', async (req, res) => {
    const { id } = req.params;
    const { poster } = req.body;
    try {
        const success = movieOperations.updatePoster(id, poster);
        if (!success) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const updated = movieOperations.getById(id);
        res.json(updated);
    } catch (err) {
        console.error('Error updating poster:', err);
        res.status(500).json({ error: 'Could not update poster' });
    }
});

// Dummy user register route
app.get('/api/register-dummy', async (_req, res) => {
    try {
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = new User({ email: 'test@example.com', password: '1234' });
            await user.save();
            res.send("User created");
        } else {
            res.send("User already exists");
        }
    } catch (err) {
        console.error('Error creating dummy user:', err);
        res.status(500).send("Error creating user");
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Middleware to verify admin authentication
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { username: username, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({ 
                message: 'Admin login successful',
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (err) {
        console.error('Error during admin login:', err);
        res.status(500).json({ message: 'Server error during admin login.' });
    }
});

// Admin: Get all movies with full details
app.get('/api/admin/movies', verifyAdmin, async (req, res) => {
    try {
        const movies = movieOperations.getAll();
        res.json(movies);
    } catch (err) {
        console.error('Error fetching admin movies:', err);
        res.status(500).json({ error: 'Failed to fetch movies.' });
    }
});

// Admin: Delete a movie
app.delete('/api/admin/movies/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = movieOperations.getById(id);
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        const success = movieOperations.delete(id);
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete movie' });
        }
        
        res.json({ message: 'Movie deleted successfully', movie: movie });
    } catch (err) {
        console.error('Error deleting movie:', err);
        res.status(500).json({ error: 'Failed to delete movie.' });
    }
});

// Admin: Update a movie
app.put('/api/admin/movies/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const success = movieOperations.update(id, updateData);
        
        if (!success) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        const updatedMovie = movieOperations.getById(id);
        res.json(updatedMovie);
    } catch (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ error: 'Failed to update movie.' });
    }
});

// Admin: Get statistics
app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
    try {
        const totalMovies = movieOperations.count();
        const totalUsers = await User.countDocuments();
        const moviesByGenre = movieOperations.getByGenre();
        
        res.json({
            totalMovies,
            totalUsers,
            moviesByGenre
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics.' });
    }
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});


