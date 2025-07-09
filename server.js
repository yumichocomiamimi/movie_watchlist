import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './user.js';

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from frontend

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/movies')
.then(() => {
    console.log('MongoDB connected');
    // Start server only after DB connects
    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Movie schema and model
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number,
    genre: String,
    poster: String,
    imdbID: String,
    review: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Search for a movie by title (partial match, case-insensitive, for autocomplete)
app.get('/movies/search', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required.' });
    }
    try {
        // Use regex for partial, case-insensitive match
        const movies = await Movie.find({ title: { $regex: title, $options: 'i' } }).limit(10);
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
        const movies = await Movie.find();
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
        const movie = new Movie(req.body);
        await movie.save();
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
        const updated = await Movie.findByIdAndUpdate(id, { poster }, { new: true });
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


