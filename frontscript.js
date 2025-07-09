const OMDB_API_KEY = "8545112";
const BASE_URL = "http://localhost:3000";
let allMovies = [];
let watchlist = [];
let isGridView = true;
let currentSort = 'title';

// UI Elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const watchlistContainer = document.getElementById("watchlist");
const emptyState = document.getElementById("emptyState");
const sortBtn = document.getElementById("sortBtn");
const sortDropdown = document.getElementById("sortDropdown");
const viewToggle = document.getElementById("viewToggle");
const scrollToTop = document.getElementById("scrollToTop");
const modal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const notification = document.getElementById("notification");
let suggestionBox = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    setupEventListeners();
    setupScrollToTop();
});

// Load movies from backend
async function loadMovies() {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/movies`);
        if (response.ok) {
            allMovies = await response.json();
            
            // Fetch missing posters
            for (let i = 0; i < allMovies.length; i++) {
                const movie = allMovies[i];
                if (!movie.poster && movie.imdbID) {
                    try {
                        const posterRes = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
                        const posterData = await posterRes.json();
                        if (posterData.Poster && posterData.Poster !== "N/A") {
                            allMovies[i].poster = posterData.Poster;
                            // Update poster in backend
                            await fetch(`${BASE_URL}/movies/${movie._id}/poster`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ poster: posterData.Poster })
                            });
                        }
                    } catch (err) {
                        console.error('Error fetching poster:', err);
                    }
                }
            }
            
            displayWatchlist();
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        showNotification('Error loading movies', 'error');
    } finally {
        showLoading(false);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener("click", searchMovie);
    searchInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            searchMovie();
            if (suggestionBox) suggestionBox.remove();
        }
    });
    
    // Search suggestions
    searchInput.addEventListener("input", handleSearchInput);
    searchInput.addEventListener("blur", function() {
        setTimeout(() => {
            if (suggestionBox) suggestionBox.remove();
        }, 100);
    });
    
    // Sort functionality
    sortBtn.addEventListener('click', () => {
        sortDropdown.classList.toggle('show');
    });
    
    sortDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSort = e.target.dataset.sort;
            sortMovies(currentSort);
            sortDropdown.classList.remove('show');
        }
    });
    
    // View toggle
    viewToggle.addEventListener('click', toggleView);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
            sortDropdown.classList.remove('show');
        }
        if (suggestionBox && !searchInput.contains(e.target)) {
            suggestionBox.remove();
        }
    });
}

// Search input handler with suggestions
function handleSearchInput() {
    const query = searchInput.value.trim().toLowerCase();
    if (suggestionBox) suggestionBox.remove();
    
    if (!query) return;
    
    const suggestions = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    ).slice(0, 5);
    
    if (suggestions.length === 0) return;
    
    suggestionBox = document.createElement("div");
    suggestionBox.id = "suggestionBox";
    
    const searchBox = document.querySelector('.search-box');
    const rect = searchBox.getBoundingClientRect();
    
    Object.assign(suggestionBox.style, {
        position: "absolute",
        left: rect.left + "px",
        top: (rect.bottom + window.scrollY) + "px",
        width: rect.width + "px",
        zIndex: "1000"
    });
    
    suggestions.forEach(movie => {
        const item = document.createElement("div");
        item.innerHTML = highlightMatch(movie.title, query);
        
        item.addEventListener("mousedown", function(e) {
            e.preventDefault();
            searchInput.value = movie.title;
            if (suggestionBox) suggestionBox.remove();
            searchMovie();
        });
        
        suggestionBox.appendChild(item);
    });
    
    document.body.appendChild(suggestionBox);
}

function highlightMatch(title, query) {
    const idx = title.toLowerCase().indexOf(query.toLowerCase());
    if (idx >= 0) {
        return `${title.slice(0, idx)}<b>${title.slice(idx, idx + query.length)}</b>${title.slice(idx + query.length)}`;
    }
    return title;
}
// Search movies
async function searchMovie() {
    const query = searchInput.value.trim();
    searchResults.innerHTML = "";
    
    if (!query) {
        showNotification("Please enter a movie name", "warning");
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${BASE_URL}/movies/search?title=${encodeURIComponent(query)}`);
        
        if (response.status === 404) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No movies found</h3>
                    <p>Try searching with different keywords</p>
                </div>
            `;
            return;
        }
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        let movies = await response.json();
        if (!Array.isArray(movies)) {
            movies = movies ? [movies] : [];
        }
        
        if (movies.length === 0) {
            searchResults.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No movies found</h3>
                    <p>Try searching with different keywords</p>
                </div>
            `;
            return;
        }
        
        // Fetch missing posters
        for (const movie of movies) {
            if ((!movie.poster || movie.poster === "N/A") && movie.imdbID) {
                try {
                    const posterRes = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
                    const posterData = await posterRes.json();
                    if (posterData.Poster && posterData.Poster !== "N/A") {
                        movie.poster = posterData.Poster;
                    }
                } catch (err) {
                    console.error("Error fetching poster:", err);
                }
            }
        }
        
        renderMovies(movies, searchResults, true);
        
    } catch (error) {
        console.error("Error searching movies:", error);
        showNotification("Error searching for movies", "error");
    } finally {
        showLoading(false);
    }
}

// Display watchlist
function displayWatchlist() {
    if (allMovies.length === 0) {
        emptyState.style.display = 'block';
        watchlistContainer.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    watchlistContainer.style.display = 'grid';
    
    const sortedMovies = sortMovies(currentSort, [...allMovies]);
    renderMovies(sortedMovies, watchlistContainer, false);
}

// Render movies
function renderMovies(movies, container, isSearchResult = false) {
    container.innerHTML = "";
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie, isSearchResult);
        container.appendChild(movieCard);
    });
}

// Create movie card
function createMovieCard(movie, isSearchResult = false) {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie";
    
    const poster = movie.poster && movie.poster !== 'N/A' 
        ? movie.poster 
        : 'https://via.placeholder.com/300x450?text=No+Image';
    
    movieDiv.innerHTML = `
        <img src="${poster}" alt="${movie.title}" loading="lazy">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                ${movie.year ? `<span class="movie-year"><i class="fas fa-calendar"></i> ${movie.year}</span>` : ''}
                ${movie.genre ? `<span class="movie-genre"><i class="fas fa-tag"></i> ${movie.genre}</span>` : ''}
                ${movie.imdb_rating ? `<span class="movie-rating"><i class="fas fa-star"></i> ${movie.imdb_rating}/10</span>` : ''}
            </div>
            ${movie.review ? `<p class="movie-review">${movie.review}</p>` : ''}
            <div class="movie-actions">
                ${isSearchResult 
                    ? `<button class="btn-primary" onclick="addToWatchlist('${movie._id || movie.imdbID}')">
                         <i class="fas fa-plus"></i> Add to List
                       </button>`
                    : `<button class="btn-danger" onclick="removeFromWatchlist('${movie._id || movie.imdbID}')">
                         <i class="fas fa-trash"></i> Remove
                       </button>`
                }
                <button class="btn-secondary" onclick="showMovieDetails('${movie._id || movie.imdbID}')">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `;
    
    // Add click event for movie details
    movieDiv.querySelector('img').addEventListener('click', () => showMovieDetails(movie._id || movie.imdbID));
    
    return movieDiv;
}

// Add to watchlist
window.addToWatchlist = async function(id) {
    const movie = allMovies.find(m => m._id === id || m.imdbID === id);
    if (!movie) {
        showNotification("Movie not found", "error");
        return;
    }
    
    if (allMovies.some(m => (m._id === id || m.imdbID === id))) {
        showNotification("Movie already in watchlist", "warning");
        return;
    }
    
    // Add movie to database if not exists
    try {
        const response = await fetch(`${BASE_URL}/movies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie)
        });
        
        if (response.ok) {
            const addedMovie = await response.json();
            allMovies.push(addedMovie);
            displayWatchlist();
            showNotification("Added to watchlist!", "success");
            
            // Clear search results
            searchResults.innerHTML = "";
            searchInput.value = "";
        } else {
            throw new Error('Failed to add movie');
        }
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        showNotification("Error adding to watchlist", "error");
    }
};

// Remove from watchlist
window.removeFromWatchlist = async function(id) {
    const movie = allMovies.find(m => m._id === id || m.imdbID === id);
    if (!movie) {
        showNotification("Movie not found", "error");
        return;
    }
    
    if (!confirm(`Remove "${movie.title}" from your watchlist?`)) {
        return;
    }
    
    try {
        // Note: We don't actually delete from database, just remove from UI
        // If you want to delete from database, implement DELETE endpoint
        allMovies = allMovies.filter(m => m._id !== id && m.imdbID !== id);
        displayWatchlist();
        showNotification("Removed from watchlist", "success");
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        showNotification("Error removing from watchlist", "error");
    }
};

// Show movie details in modal
window.showMovieDetails = async function(id) {
    const movie = allMovies.find(m => m._id === id || m.imdbID === id);
    if (!movie) {
        showNotification("Movie not found", "error");
        return;
    }
    
    // Fetch additional details from OMDB if needed
    let detailedMovie = movie;
    if (movie.imdbID && (!movie.plot || !movie.director)) {
        try {
            const response = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}&plot=full`);
            const omdbData = await response.json();
            if (omdbData.Response === "True") {
                detailedMovie = { ...movie, ...omdbData };
            }
        } catch (err) {
            console.error("Error fetching movie details:", err);
        }
    }
    
    const poster = detailedMovie.Poster || detailedMovie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
    
    movieDetails.innerHTML = `
        <div class="movie-details-modal">
            <img src="${poster}" alt="${detailedMovie.Title || detailedMovie.title}">
            <div class="movie-details-content">
                <h2>${detailedMovie.Title || detailedMovie.title}</h2>
                <div class="movie-details-meta">
                    <div>
                        <strong>Year</strong>
                        <span>${detailedMovie.Year || detailedMovie.year || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Genre</strong>
                        <span>${detailedMovie.Genre || detailedMovie.genre || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Director</strong>
                        <span>${detailedMovie.Director || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Actors</strong>
                        <span>${detailedMovie.Actors || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Runtime</strong>
                        <span>${detailedMovie.Runtime || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>IMDB Rating</strong>
                        <span>${detailedMovie.imdbRating || detailedMovie.imdb_rating || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Local Rating</strong>
                        <span>${detailedMovie.imdb_rating ? `${detailedMovie.imdb_rating}/10` : 'N/A'}</span>
                    </div>
                </div>
                ${detailedMovie.Plot ? `
                    <div class="movie-details-review">
                        <h3>Plot</h3>
                        <p>${detailedMovie.Plot}</p>
                    </div>
                ` : ''}
                ${detailedMovie.review ? `
                    <div class="movie-details-review">
                        <h3>Your Review</h3>
                        <p>${detailedMovie.review}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
};

// Sort movies
function sortMovies(sortType, movies = allMovies) {
    const sorted = [...movies];
    
    switch (sortType) {
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'year':
            sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case 'genre':
            sorted.sort((a, b) => (a.genre || '').localeCompare(b.genre || ''));
            break;
        case 'dateAdded':
            sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
    }
    
    if (movies === allMovies) {
        renderMovies(sorted, watchlistContainer, false);
    }
    
    return sorted;
}

// Toggle view
function toggleView() {
    isGridView = !isGridView;
    const icon = viewToggle.querySelector('i');
    
    if (isGridView) {
        watchlistContainer.classList.remove('list-view');
        icon.className = 'fas fa-th-large';
    } else {
        watchlistContainer.classList.add('list-view');
        icon.className = 'fas fa-list';
    }
}

// Setup scroll to top
function setupScrollToTop() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Show/hide loading
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}