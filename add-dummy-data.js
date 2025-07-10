import { movieOperations } from './database.js';

// Dummy data arrays
const dummyPosters = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUE1NDZBIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5Nb3ZpZSBQb3N0ZXI8L3RleHQ+Cjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMkE2NUJGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5UYW1pbCBGaWxtPC90ZXh0Pgo8L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjNkMzNzNGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5BY3Rpb24gTW92aWU8L3RleHQ+Cjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjOEI1Q0Y2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5EcmFtYSBGaWxtPC90ZXh0Pgo8L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjU5RTBCIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5Sb21hbmNlPC90ZXh0Pgo8L3N2Zz4='
];

const dummyReviews = [
    "A gripping neo-noir thriller with stellar performances by Madhavan and Vijay Sethupathi.",
    "An outstanding film that showcases brilliant direction and exceptional storytelling.",
    "A masterpiece of Tamil cinema with powerful performances and compelling narrative.",
    "Excellent cinematography and strong character development make this a must-watch.",
    "Brilliant screenplay with outstanding performances from the entire cast.",
    "A thought-provoking drama that explores deep themes with great sensitivity.",
    "Action-packed thriller with stunning visuals and engaging plot twists.",
    "Remarkable storytelling with exceptional direction and memorable characters.",
    "A beautiful blend of emotion and entertainment with top-notch performances.",
    "Outstanding work in all technical aspects with compelling character arcs.",
    "Impressive debut with fresh perspectives and innovative filmmaking techniques.",
    "Classic Tamil cinema at its finest with timeless storytelling and performances.",
    "Modern masterpiece that combines commercial appeal with artistic excellence.",
    "Engaging narrative with strong emotional core and excellent production values.",
    "Phenomenal acting combined with brilliant direction creates cinematic magic."
];

const dummyImdbIds = [
    "tt1234567", "tt2345678", "tt3456789", "tt4567890", "tt5678901",
    "tt6789012", "tt7890123", "tt8901234", "tt9012345", "tt0123456",
    "tt1357924", "tt2468135", "tt3691470", "tt4815162", "tt5927384"
];

async function addDummyData() {
    try {
        console.log('Adding dummy data to all movies...');
        
        // Get all movies
        const movies = movieOperations.getAll();
        console.log(`Found ${movies.length} movies to update`);
        
        let updatedCount = 0;
        
        for (const movie of movies) {
            // Generate dummy data
            const randomPoster = dummyPosters[Math.floor(Math.random() * dummyPosters.length)];
            const randomReview = dummyReviews[Math.floor(Math.random() * dummyReviews.length)];
            const randomImdbId = dummyImdbIds[Math.floor(Math.random() * dummyImdbIds.length)];
            
            // Update movie with dummy data
            const updateData = {
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                poster: randomPoster,
                imdbID: randomImdbId,
                review: randomReview,
                imdb_rating: movie.imdb_rating
            };
            
            const success = movieOperations.update(movie.id, updateData);
            if (success) {
                updatedCount++;
                console.log(`Updated: ${movie.title}`);
            }
        }
        
        console.log(`\nDummy data update completed!`);
        console.log(`Successfully updated ${updatedCount} movies`);
        
        // Show statistics
        const totalMovies = movieOperations.count();
        console.log(`\nDatabase now contains ${totalMovies} movies with dummy data`);
        
    } catch (error) {
        console.error('Error adding dummy data:', error);
    }
}

// Run the dummy data function
addDummyData();
