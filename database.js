import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database connection
const db = new Database(path.join(__dirname, 'movies.db'));

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Create tables
const createTables = () => {
    // Movies table
    const createMoviesTable = `
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            year INTEGER,
            genre TEXT,
            poster TEXT,
            imdbID TEXT,
            review TEXT,
            imdb_rating REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.exec(createMoviesTable);
    db.exec(createUsersTable);
    
    console.log('SQLite database tables created successfully');
};

// Movie operations
const movieOperations = {
    // Get all movies
    getAll: () => {
        const stmt = db.prepare('SELECT * FROM movies ORDER BY title');
        return stmt.all();
    },

    // Search movies by title
    searchByTitle: (title) => {
        const stmt = db.prepare('SELECT * FROM movies WHERE title LIKE ? LIMIT 10');
        return stmt.all(`%${title}%`);
    },

    // Get movie by ID
    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM movies WHERE id = ?');
        return stmt.get(id);
    },

    // Add new movie
    create: (movieData) => {
        const stmt = db.prepare(`
            INSERT INTO movies (title, year, genre, poster, imdbID, review, imdb_rating)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            movieData.title,
            movieData.year,
            movieData.genre,
            movieData.poster,
            movieData.imdbID,
            movieData.review,
            movieData.imdb_rating
        );
        return { id: result.lastInsertRowid, ...movieData };
    },

    // Update movie
    update: (id, movieData) => {
        const stmt = db.prepare(`
            UPDATE movies 
            SET title = ?, year = ?, genre = ?, poster = ?, imdbID = ?, review = ?, imdb_rating = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            movieData.title,
            movieData.year,
            movieData.genre,
            movieData.poster,
            movieData.imdbID,
            movieData.review,
            movieData.imdb_rating,
            id
        );
        return result.changes > 0;
    },

    // Update poster only
    updatePoster: (id, poster) => {
        const stmt = db.prepare('UPDATE movies SET poster = ? WHERE id = ?');
        const result = stmt.run(poster, id);
        return result.changes > 0;
    },

    // Delete movie
    delete: (id) => {
        const stmt = db.prepare('DELETE FROM movies WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    },

    // Count movies
    count: () => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM movies');
        return stmt.get().count;
    },

    // Get movies by genre (for statistics)
    getByGenre: () => {
        const stmt = db.prepare(`
            SELECT genre as _id, COUNT(*) as count 
            FROM movies 
            WHERE genre IS NOT NULL 
            GROUP BY genre 
            ORDER BY count DESC
        `);
        return stmt.all();
    }
};

// User operations
const userOperations = {
    // Get user by email
    getByEmail: (email) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    },

    // Create new user
    create: (userData) => {
        const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        const result = stmt.run(userData.email, userData.password);
        return { id: result.lastInsertRowid, ...userData };
    },

    // Count users
    count: () => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
        return stmt.get().count;
    }
};

// Initialize database
createTables();

export { db, movieOperations, userOperations };
