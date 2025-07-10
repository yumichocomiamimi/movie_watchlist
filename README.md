# Movie Watchlist Application

A modern, full-stack movie watchlist application with a beautiful dark theme UI, admin panel, and comprehensive movie management features.

## 🎬 Features

### User Features
- **Browse Movies**: View a curated collection of Tamil movies with ratings and details
- **### Environment Variables
- `PORT`: Server port (default: 3000)
- `ADMIN_USERNAME`: Admin panel username
- `ADMIN_PASSWORD`: Admin panel password
- `OMDB_API_KEY`: OMDB API key for movie data
- `JWT_SECRET`: Secret key for JWT token generationFunctionality**: Real-time search with autocomplete suggestions
- **Movie Details**: Detailed view with plot, cast, ratings, and reviews
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern, eye-friendly dark theme with cyan accents
- **Sort & Filter**: Sort movies by title, year, genre, or date added
- **Grid/List View**: Toggle between grid and list view modes

### Admin Features
- **Admin Dashboard**: Secure admin panel with authentication
- **Movie Management**: Add, edit, delete, and manage movies
- **Statistics**: View movie statistics and genre distribution
- **User Management**: Monitor user activity and registrations
- **Bulk Operations**: Seed database with movie collections

## 🚀 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Modern vanilla JavaScript with async/await
- **Font Awesome** - Icons and visual elements

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database for storing movies and users
- **better-sqlite3** - Fast SQLite driver for Node.js
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **OMDB API** - Movie poster and additional movie information

## 📁 Project Structure

```
movie_watchlist/
├── server.js                 # Main server file
├── user.js                   # User model
├── database.js               # SQLite database operations
├── seed-database.js          # Database seeding script
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── README.md                 # Documentation
├── movie_list.dart           # Tamil movies data
├── movies.db                 # SQLite database file (created automatically)
│
├── Frontend/
│   ├── index.html            # Main application page
│   ├── admin.html            # Admin panel
│   ├── login.html            # User login page
│   ├── decor.css             # Main styles
│   ├── admin.css             # Admin panel styles
│   ├── frontscript.js        # Frontend JavaScript
│   └── admin.js              # Admin panel JavaScript
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Git

### SQLite Database
This application uses SQLite, a lightweight, file-based database that requires no separate installation or setup. The database file (`movies.db`) will be created automatically when you first run the application.

### 1. Clone Repository
```bash
git clone <repository-url>
cd movie_watchlist
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
OMDB_API_KEY=8545112
JWT_SECRET=your_jwt_secret_here
```

### 4. Database Setup
Seed the database with Tamil movies:
```bash
# Seed database with Tamil movies
npm run seed
```

### 5. Start Application
```bash
# Production mode
npm start

# Development mode
npm run dev
```

### 6. Access Application
- **Main App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Public Endpoints

#### Get All Movies
```http
GET /movies
```
**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Baasha",
    "year": 1995,
    "genre": "Action",
    "poster": "https://example.com/poster.jpg",
    "imdbID": "tt0112508",
    "review": "Great movie",
    "imdb_rating": 8.2
  }
]
```

#### Search Movies
```http
GET /movies/search?title=baasha
```
**Parameters:**
- `title` (string, required): Movie title to search

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Baasha",
    "year": 1995,
    "genre": "Action",
    "imdb_rating": 8.2
  }
]
```

#### Add Movie
```http
POST /movies
```
**Body:**
```json
{
  "title": "Movie Title",
  "year": 2023,
  "genre": "Action",
  "poster": "https://example.com/poster.jpg",
  "imdbID": "tt1234567",
  "review": "Great movie",
  "imdb_rating": 8.5
}
```

#### Update Movie Poster
```http
PATCH /movies/:id/poster
```
**Body:**
```json
{
  "poster": "https://example.com/new-poster.jpg"
}
```

### User Endpoints

#### User Login
```http
POST /api/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Create Dummy User
```http
GET /api/register-dummy
```

### Admin Endpoints

#### Admin Login
```http
POST /api/admin/login
```
**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "token": "jwt_token_here"
}
```

#### Get Admin Movies
```http
GET /api/admin/movies
Authorization: Bearer <token>
```

#### Delete Movie (Admin)
```http
DELETE /api/admin/movies/:id
Authorization: Bearer <token>
```

#### Update Movie (Admin)
```http
PUT /api/admin/movies/:id
Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "Updated Title",
  "year": 2023,
  "genre": "Drama",
  "imdb_rating": 8.8
}
```

#### Get Statistics (Admin)
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalMovies": 95,
  "totalUsers": 5,
  "moviesByGenre": [
    {"_id": "Action", "count": 25},
    {"_id": "Drama", "count": 20}
  ]
}
```

## 🎨 UI/UX Features

### Design Elements
- **Modern Dark Theme**: Deep blue/purple gradients with cyan accents
- **Responsive Grid**: Auto-adjusting movie cards for all screen sizes
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Glassmorphism**: Translucent elements with backdrop blur effects
- **Typography**: Clean, readable fonts with proper hierarchy

### Interactive Features
- **Real-time Search**: Instant search results with highlighting
- **Modal Dialogs**: Detailed movie information in overlay modals
- **Dropdown Menus**: Sorting and filtering options
- **Loading States**: Visual feedback during data loading
- **Notifications**: Toast messages for user actions
- **Scroll to Top**: Floating action button for easy navigation

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `ADMIN_USERNAME`: Admin panel username
- `ADMIN_PASSWORD`: Admin panel password
- `OMDB_API_KEY`: OMDB API key for movie data
- `JWT_SECRET`: Secret key for JWT token generation

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## 📊 Database Schema

### Movie Schema (SQLite)
```sql
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    poster TEXT,
    imdbID TEXT,
    review TEXT,
    imdb_rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Schema (SQLite)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Usage Examples

### Adding a New Movie
1. Navigate to the admin panel
2. Login with admin credentials
3. Go to "Add Movie" section
4. Fill in movie details
5. Submit the form

### Searching Movies
1. Type movie name in search box
2. Select from autocomplete suggestions
3. View search results
4. Click on movie for details

### Managing Watchlist
1. Browse or search for movies
2. Click "Add to List" button
3. View your watchlist
4. Remove movies as needed

## 🐛 Known Issues & Solutions

### Issue: Movies not loading
**Solution**: Check if the SQLite database file exists and has proper permissions

### Issue: Admin login failing
**Solution**: Verify admin credentials in .env file

### Issue: Database errors
**Solution**: Delete movies.db file and restart the application to recreate the database

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Tamil movie data curated from various sources
- OMDB API for movie information and posters
- Font Awesome for icons
- MongoDB for database solutions

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation above
- Review the known issues section

---

**Made with ❤️ for Tamil Cinema Lovers**