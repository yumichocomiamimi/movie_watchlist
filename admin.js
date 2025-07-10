const BASE_URL = "http://localhost:3000";
let adminToken = localStorage.getItem('adminToken');
let allMovies = [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const logoutBtn = document.getElementById('logoutBtn');
const navBtns = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const editModal = document.getElementById('editModal');
const editMovieForm = document.getElementById('editMovieForm');
const addMovieForm = document.getElementById('addMovieForm');

// Check if already logged in
if (adminToken) {
    showDashboard();
    loadDashboardData();
}

// Login form submission
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(adminLoginForm);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
            adminToken = data.token;
            localStorage.setItem('adminToken', adminToken);
            showDashboard();
            loadDashboardData();
            showMessage('Login successful!', 'success');
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Login error:', error);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    adminToken = null;
    loginForm.style.display = 'flex';
    adminDashboard.style.display = 'none';
    adminLoginForm.reset();
});

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        
        // Update active nav button
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding section
        contentSections.forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
        
        // Load section data
        if (section === 'movies') {
            loadMovies();
        } else if (section === 'stats') {
            loadStats();
        }
    });
});

// Add movie form
addMovieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addMovieForm);
    const movieData = {
        title: formData.get('title'),
        year: formData.get('year') ? parseInt(formData.get('year')) : undefined,
        genre: formData.get('genre'),
        poster: formData.get('poster'),
        imdbID: formData.get('imdbID'),
        review: formData.get('review'),
        imdb_rating: formData.get('imdb_rating') ? parseFloat(formData.get('imdb_rating')) : undefined
    };

    // Remove empty fields
    Object.keys(movieData).forEach(key => {
        if (movieData[key] === '' || movieData[key] === undefined) {
            delete movieData[key];
        }
    });

    try {
        const response = await fetch(`${BASE_URL}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });

        if (response.ok) {
            showMessage('Movie added successfully!', 'success');
            addMovieForm.reset();
            loadMovies(); // Refresh movie list if on movies tab
        } else {
            const error = await response.json();
            showMessage(error.error || 'Failed to add movie', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Add movie error:', error);
    }
});

// Edit movie form
editMovieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const movieId = document.getElementById('editMovieId').value;
    const formData = new FormData(editMovieForm);
    const movieData = {
        title: formData.get('title'),
        year: formData.get('year') ? parseInt(formData.get('year')) : undefined,
        genre: formData.get('genre'),
        poster: formData.get('poster'),
        imdbID: formData.get('imdbID'),
        review: formData.get('review'),
        imdb_rating: formData.get('imdb_rating') ? parseFloat(formData.get('imdb_rating')) : undefined
    };

    // Remove empty fields
    Object.keys(movieData).forEach(key => {
        if (movieData[key] === '' || movieData[key] === undefined) {
            delete movieData[key];
        }
    });

    try {
        const response = await fetch(`${BASE_URL}/api/admin/movies/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(movieData)
        });

        if (response.ok) {
            showMessage('Movie updated successfully!', 'success');
            editModal.style.display = 'none';
            loadMovies(); // Refresh movie list
        } else {
            const error = await response.json();
            showMessage(error.error || 'Failed to update movie', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Update movie error:', error);
    }
});

// Modal close
document.querySelector('.close').addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Movie search
document.getElementById('movieSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        (movie.genre && movie.genre.toLowerCase().includes(searchTerm)) ||
        (movie.year && movie.year.toString().includes(searchTerm))
    );
    renderMoviesTable(filteredMovies);
});

// Functions
function showDashboard() {
    loginForm.style.display = 'none';
    adminDashboard.style.display = 'block';
    document.getElementById('welcomeMessage').textContent = 'Welcome, Admin';
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Add to the current active section
    const activeSection = document.querySelector('.content-section.active') || 
                          document.querySelector('.login-card');
    activeSection.insertBefore(messageDiv, activeSection.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

async function loadDashboardData() {
    loadStats();
    loadMovies();
}

async function loadStats() {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            
            document.getElementById('totalMovies').textContent = stats.totalMovies;
            document.getElementById('totalUsers').textContent = stats.totalUsers;
            
            if (stats.moviesByGenre.length > 0) {
                document.getElementById('popularGenre').textContent = stats.moviesByGenre[0]._id || 'Unknown';
                renderGenreChart(stats.moviesByGenre);
            } else {
                document.getElementById('popularGenre').textContent = 'No data';
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadMovies() {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/movies`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            allMovies = await response.json();
            renderMoviesTable(allMovies);
        }
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function renderGenreChart(genreData) {
    const chartContainer = document.getElementById('genreChart');
    chartContainer.innerHTML = '';

    const maxCount = Math.max(...genreData.map(g => g.count));

    genreData.forEach(genre => {
        const genreBar = document.createElement('div');
        genreBar.className = 'genre-bar';

        const percentage = (genre.count / maxCount) * 100;

        genreBar.innerHTML = `
            <span class="genre-label">${genre._id || 'Unknown'}</span>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="genre-count">${genre.count}</span>
        `;

        chartContainer.appendChild(genreBar);
    });
}

function renderMoviesTable(movies) {
    const tbody = document.getElementById('moviesTableBody');
    tbody.innerHTML = '';

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${movie.poster || 'https://via.placeholder.com/60x90?text=No+Image'}" 
                     alt="${movie.title}" class="movie-poster">
            </td>
            <td>${movie.title}</td>
            <td>${movie.year || 'N/A'}</td>
            <td>${movie.genre || 'N/A'}</td>
            <td>${movie.imdbID || 'N/A'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editMovie('${movie._id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteMovie('${movie._id}', '${movie.title}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editMovie(movieId) {
    const movie = allMovies.find(m => m._id === movieId);
    if (!movie) return;

    document.getElementById('editMovieId').value = movie._id;
    document.getElementById('editMovieTitle').value = movie.title;
    document.getElementById('editMovieYear').value = movie.year || '';
    document.getElementById('editMovieGenre').value = movie.genre || '';
    document.getElementById('editMoviePoster').value = movie.poster || '';
    document.getElementById('editMovieImdbID').value = movie.imdbID || '';
    document.getElementById('editMovieRating').value = movie.imdb_rating || '';
    document.getElementById('editMovieReview').value = movie.review || '';

    editModal.style.display = 'block';
}

async function deleteMovie(movieId, movieTitle) {
    if (!confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/movies/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            showMessage('Movie deleted successfully!', 'success');
            loadMovies(); // Refresh movie list
            loadStats(); // Refresh stats
        } else {
            const error = await response.json();
            showMessage(error.error || 'Failed to delete movie', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Delete movie error:', error);
    }
}

// Make functions global for onclick handlers
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;
