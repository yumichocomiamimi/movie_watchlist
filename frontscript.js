const OMDB_API_KEY = "8545112";
const BASE_URL = "http://localhost:8080"; // Backend server URL
let allMovies = [];
let watchlist = [];

// Fetch all movies from backend and populate allMovies
fetch(`${BASE_URL}/movies`)
  .then(res => res.json())
  .then(data => {
    allMovies = data;

    // Fetch missing posters
    allMovies.forEach((movie, idx) => {
      if (!movie.poster && movie.imdbID) {
        fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`)
          .then(res => res.json())
          .then(posterData => {
            if (posterData.Poster && posterData.Poster !== "N/A") {
              allMovies[idx].poster = posterData.Poster;

              // Update UI if image was previously missing
              document.querySelectorAll(".movie img").forEach(img => {
                if (img.alt === movie.title) {
                  img.src = posterData.Poster;
                }
              });
            }
          });
      }
    });

    displayWatchlist(); // Only display after data is ready
  });

let suggestionBox = null;
const searchInput = document.getElementById("searchInput");
function highlightMatch(title, query) {
  const idx = title.toLowerCase().indexOf(query);
  if (idx === 0) {
    return `<b>${title.slice(0, query.length)}</b>${title.slice(query.length)}`;
  }
  return title;
}
searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  if (suggestionBox) suggestionBox.remove();
  if (!query) return;

  const suggestions = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(query)
  );
  if (suggestions.length === 0) return;

  suggestionBox = document.createElement("div");
  Object.assign(suggestionBox.style, {
    position: "absolute",
    background: "#16213e",
    color: "#e0f7fa",
    border: "1px solid #00e6ff",
    borderRadius: "0 0 6px 6px",
    width: searchInput.offsetWidth + "px",
    maxHeight: "180px",
    overflowY: "auto",
    zIndex: "100",
    left: searchInput.getBoundingClientRect().left + "px",
    top: (searchInput.getBoundingClientRect().bottom + window.scrollY) + "px",
    boxShadow: "0 2px 8px #00e6ff33"
  });
  suggestionBox.id = "suggestionBox";

  suggestions.forEach(movie => {
    const item = document.createElement("div");
    item.innerHTML = highlightMatch(movie.title, query);
    Object.assign(item.style, {
      padding: "8px 12px",
      cursor: "pointer"
    });

    item.addEventListener("mousedown", function (e) {
      e.preventDefault();
      searchInput.value = movie.title;
      if (suggestionBox) suggestionBox.remove();
      searchMovie();
    });
    item.addEventListener("mouseover", () => item.style.background = "#00e6ff22");
    item.addEventListener("mouseout", () => item.style.background = "transparent");

    suggestionBox.appendChild(item);
  });

  document.body.appendChild(suggestionBox);
});

document.addEventListener("click", function (e) {
  if (suggestionBox && !searchInput.contains(e.target)) {
    suggestionBox.remove();
  }
});

searchInput.addEventListener("blur", function () {
  setTimeout(() => {
    if (suggestionBox) suggestionBox.remove();
  }, 100);
});

function displayWatchlist() {
  const container = document.getElementById("watchlist");
  container.innerHTML = "";
  if (watchlist.length === 0) {
    container.innerHTML = "<span style='color:#e0f7fa;'>Your watchlist is empty.</span>";
    return;
  }
  watchlist.forEach(movie => {
    const item = document.createElement("div");
    item.className = "movie";
    item.innerHTML = `
      <img src="${movie.poster && movie.poster !== 'N/A' ? movie.poster : 'http://via.placeholder.com/100x150?text=No+Image'}" alt="${movie.title}">
      <div class="movie-info" tabindex="0">
        <strong>${movie.title}</strong> (${movie.year})<br>
        Genre: ${movie.genre}<br>
        <em>Review:</em> ${movie.review || ''}<br>
      </div>
    `;
    container.appendChild(item);
  });
}

async function searchMovie() {
  const query = document.getElementById("searchInput").value.trim();
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.innerHTML = "Please enter a movie name.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/movies/search?title=${encodeURIComponent(query)}`);
    if (response.status === 404) {
      searchResults.innerHTML = "No movies found matching your query.";
      return;
    }
    if (!response.ok) {
      searchResults.innerHTML = "Error searching for movie.";
      return;
    }
    const movie = await response.json();

    // Fetch poster from OMDB if missing or "N/A"
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

    const resultDiv = document.createElement("div");
    resultDiv.className = "movie";
    resultDiv.innerHTML = `
      <img src="${movie.poster && movie.poster !== 'N/A' ? movie.poster : 'http://via.placeholder.com/100x150?text=No+Image'}" alt="${movie.title}">
      <div class="movie-info" tabindex="0">
        <strong>${movie.title}</strong> (${movie.year})<br>
        Genre: ${movie.genre}<br>
        <em>Review:</em> ${movie.review || ''}<br>
        <button onclick="addToWatchlist('${movie._id || movie.imdbID || ''}')">Add to Watchlist</button>
      </div>
    `;
    searchResults.appendChild(resultDiv);
  } catch (err) {
    console.error("Error searching for movie:", err);
    searchResults.innerHTML = "Error searching for movie.";
  }
}
function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(m => m.imdbID !== imdbID && m._id !== imdbID);
  displayWatchlist();
}

window.removeFromWatchlist = removeFromWatchlist;

// Update displayWatchlist to add remove button
const originalDisplayWatchlist = displayWatchlist;
displayWatchlist = function () {
  const container = document.getElementById("watchlist");
  container.innerHTML = "";
  if (watchlist.length === 0) {
    container.innerHTML = "<span style='color:#e0f7fa;'>Your watchlist is empty.</span>";
    return;
  }
  watchlist.forEach(movie => {
    const item = document.createElement("div");
    item.className = "movie";
    item.innerHTML = `
      <img src="${movie.poster && movie.poster !== 'N/A' ? movie.poster : 'http://via.placeholder.com/100x150?text=No+Image'}" alt="${movie.title}">
      <div class="movie-info" tabindex="0">
        <strong>${movie.title}</strong> (${movie.year})<br>
        Genre: ${movie.genre}<br>
        <em>Review:</em> ${movie.review || ''}<br>
        <button onclick="removeFromWatchlist('${movie._id || movie.imdbID || ''}')">Remove</button>
      </div>
    `;
    container.appendChild(item);
  });
};

window.addToWatchlist = async function (imdbID) {
  const movie = allMovies.find(m => m.imdbID === imdbID || m._id === imdbID);
  const searchResults = document.getElementById("searchResults");
  if (movie && !watchlist.some(m => m.imdbID === imdbID || m._id === imdbID)) {
    // Fetch poster if missing
    if ((!movie.poster || movie.poster === "N/A") && movie.imdbID) {
      try {
        const res = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
        const posterData = await res.json();
        if (posterData.Poster && posterData.Poster !== "N/A") {
          movie.poster = posterData.Poster;
        }
      } catch (err) {
        console.error("Error fetching poster:", err);
      }
    }
    watchlist.push(movie);
    displayWatchlist();
    searchResults.innerHTML = '<span style="color:#00e6ff;">Added to watchlist!</span>';
  } else {
    searchResults.innerHTML = '<span style="color:#ff1744;">Already in watchlist.</span>';
  }
};

displayWatchlist();
  
// Add event listener for search button
document.getElementById("searchButton").addEventListener("click", searchMovie);

// Trigger search when Enter is pressed in the search input
document.getElementById("searchInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchMovie();
    if (suggestionBox) suggestionBox.remove();
  }
});