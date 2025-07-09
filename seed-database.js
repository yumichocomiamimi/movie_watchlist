import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Movie schema
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: Number,
    genre: String,
    poster: String,
    imdbID: String,
    review: String,
    imdb_rating: Number
});

const Movie = mongoose.model('Movie', movieSchema);

// Tamil movies data from movie_list.dart
const tamilMovies = [
    {
        "title": "Baasha",
        "genre": "Action",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 1995
    },
    {
        "title": "Anbe Sivam",
        "genre": "Drama",
        "imdb_rating": 8.7,
        "poster": "",
        "year": 2003
    },
    {
        "title": "Nayakan",
        "genre": "Crime",
        "imdb_rating": 8.6,
        "poster": "",
        "year": 1987
    },
    {
        "title": "Thalapathi",
        "genre": "Drama",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 1991
    },
    {
        "title": "Mouna Ragam",
        "genre": "Romance",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 1986
    },
    {
        "title": "Kadhalan",
        "genre": "Romance",
        "imdb_rating": 8.0,
        "poster": "",
        "year": 1994
    },
    {
        "title": "Iruvar",
        "genre": "Drama",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 1997
    },
    {
        "title": "Sethu",
        "genre": "Drama",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 1999
    },
    {
        "title": "Kushi",
        "genre": "Romance",
        "imdb_rating": 7.9,
        "poster": "",
        "year": 2000
    },
    {
        "title": "Ghajini",
        "genre": "Action",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2005
    },
    {
        "title": "Vinnaithaandi Varuvaayaa",
        "genre": "Romance",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2010
    },
    {
        "title": "Enthiran",
        "genre": "Sci-Fi",
        "imdb_rating": 7.1,
        "poster": "",
        "year": 2010
    },
    {
        "title": "Aadukalam",
        "genre": "Drama",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2011
    },
    {
        "title": "Mouna Guru",
        "genre": "Thriller",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2011
    },
    {
        "title": "Pizza",
        "genre": "Horror",
        "imdb_rating": 8.0,
        "poster": "",
        "year": 2012
    },
    {
        "title": "Raja Rani",
        "genre": "Romance",
        "imdb_rating": 7.5,
        "poster": "",
        "year": 2013
    },
    {
        "title": "Irandaam Ulagam",
        "genre": "Fantasy",
        "imdb_rating": 7.0,
        "poster": "",
        "year": 2013
    },
    {
        "title": "Kadal",
        "genre": "Drama",
        "imdb_rating": 6.8,
        "poster": "",
        "year": 2013
    },
    {
        "title": "Maryan",
        "genre": "Adventure",
        "imdb_rating": 7.5,
        "poster": "",
        "year": 2013
    },
    {
        "title": "Jigarthanda",
        "genre": "Crime",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2014
    },
    {
        "title": "Kaaviya Thalaivan",
        "genre": "Drama",
        "imdb_rating": 7.9,
        "poster": "",
        "year": 2014
    },
    {
        "title": "Iraivi",
        "genre": "Drama",
        "imdb_rating": 7.8,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Viswasam",
        "genre": "Action",
        "imdb_rating": 7.0,
        "poster": "",
        "year": 2019
    },
    {
        "title": "Maanagaram",
        "genre": "Thriller",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2017
    },
    {
        "title": "Aramm",
        "genre": "Drama",
        "imdb_rating": 7.5,
        "poster": "",
        "year": 2017
    },
    {
        "title": "Pudhupettai",
        "genre": "Crime",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2006
    },
    {
        "title": "Vikram Vedha",
        "genre": "Thriller",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2017
    },
    {
        "title": "Kaaka Muttai",
        "genre": "Drama",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2014
    },
    {
        "title": "Super Deluxe",
        "genre": "Drama",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2019
    },
    {
        "title": "Pariyerum Perumal",
        "genre": "Drama",
        "imdb_rating": 8.7,
        "poster": "",
        "year": 2018
    },
    {
        "title": "96",
        "genre": "Romance",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 2018
    },
    {
        "title": "Soodhu Kavvum",
        "genre": "Comedy",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2013
    },
    {
        "title": "Aruvi",
        "genre": "Drama",
        "imdb_rating": 8.6,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Vada Chennai",
        "genre": "Crime",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 2018
    },
    {
        "title": "Subramaniapuram",
        "genre": "Crime",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2008
    },
    {
        "title": "Ratsasan",
        "genre": "Thriller",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2018
    },
    {
        "title": "Asuran",
        "genre": "Action",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 2019
    },
    {
        "title": "Thani Oruvan",
        "genre": "Action",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2015
    },
    {
        "title": "Visaranai",
        "genre": "Crime",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 2015
    },
    {
        "title": "Mersal",
        "genre": "Action",
        "imdb_rating": 7.8,
        "poster": "",
        "year": 2017
    },
    {
        "title": "Master",
        "genre": "Action",
        "imdb_rating": 7.8,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Petta",
        "genre": "Action",
        "imdb_rating": 7.3,
        "poster": "",
        "year": 2019
    },
    {
        "title": "Kabali",
        "genre": "Action",
        "imdb_rating": 6.2,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Sivaji",
        "genre": "Action",
        "imdb_rating": 7.5,
        "poster": "",
        "year": 2007
    },
    {
        "title": "Dasavathaaram",
        "genre": "Action",
        "imdb_rating": 7.2,
        "poster": "",
        "year": 2008
    },
    {
        "title": "Ghilli",
        "genre": "Action",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2004
    },
    {
        "title": "Thuppakki",
        "genre": "Action",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2012
    },
    {
        "title": "Ayan",
        "genre": "Action",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 2009
    },
    {
        "title": "Vaaranam Aayiram",
        "genre": "Drama",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2008
    },
    {
        "title": "Alaipayuthey",
        "genre": "Romance",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2000
    },
    {
        "title": "Minnale",
        "genre": "Romance",
        "imdb_rating": 7.9,
        "poster": "",
        "year": 2001
    },
    {
        "title": "Kandukondain Kandukondain",
        "genre": "Romance",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 2000
    },
    {
        "title": "Kadhal Konden",
        "genre": "Romance",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2003
    },
    {
        "title": "Autograph",
        "genre": "Drama",
        "imdb_rating": 8.0,
        "poster": "",
        "year": 2004
    },
    {
        "title": "Mozhi",
        "genre": "Drama",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2007
    },
    {
        "title": "Paruthiveeran",
        "genre": "Drama",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2007
    },
    {
        "title": "Deiva Thirumagal",
        "genre": "Drama",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2011
    },
    {
        "title": "Thamizh",
        "genre": "Action",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2002
    },
    {
        "title": "Dhool",
        "genre": "Action",
        "imdb_rating": 7.2,
        "poster": "",
        "year": 2003
    },
    {
        "title": "Run",
        "genre": "Action",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 2002
    },
    {
        "title": "Chandramukhi",
        "genre": "Horror",
        "imdb_rating": 7.1,
        "poster": "",
        "year": 2005
    },
    {
        "title": "Anniyan",
        "genre": "Thriller",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2005
    },
    {
        "title": "Vettaiyaadu Vilaiyaadu",
        "genre": "Thriller",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2006
    },
    {
        "title": "Pithamagan",
        "genre": "Drama",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2003
    },
    {
        "title": "Amarkalam",
        "genre": "Action",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 1999
    },
    {
        "title": "Dhill",
        "genre": "Action",
        "imdb_rating": 7.1,
        "poster": "",
        "year": 2001
    },
    {
        "title": "Dheena",
        "genre": "Action",
        "imdb_rating": 7.2,
        "poster": "",
        "year": 2001
    },
    {
        "title": "Mugavaree",
        "genre": "Drama",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 2000
    },
    {
        "title": "Friends",
        "genre": "Comedy",
        "imdb_rating": 7.8,
        "poster": "",
        "year": 2001
    },
    {
        "title": "Boss Engira Bhaskaran",
        "genre": "Comedy",
        "imdb_rating": 7.2,
        "poster": "",
        "year": 2010
    },
    {
        "title": "Nanban",
        "genre": "Comedy",
        "imdb_rating": 7.6,
        "poster": "",
        "year": 2012
    },
    {
        "title": "Velaiilla Pattadhari",
        "genre": "Action",
        "imdb_rating": 7.8,
        "poster": "",
        "year": 2014
    },
    {
        "title": "Remo",
        "genre": "Romance",
        "imdb_rating": 6.7,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Theri",
        "genre": "Action",
        "imdb_rating": 7.1,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Kaththi",
        "genre": "Action",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2014
    },
    {
        "title": "Irudhi Suttru",
        "genre": "Drama",
        "imdb_rating": 8.0,
        "poster": "",
        "year": 2016
    },
    {
        "title": "Karnan",
        "genre": "Drama",
        "imdb_rating": 8.2,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Soorarai Pottru",
        "genre": "Drama",
        "imdb_rating": 8.7,
        "poster": "",
        "year": 2020
    },
    {
        "title": "Maara",
        "genre": "Romance",
        "imdb_rating": 7.6,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Oh My Kadavule",
        "genre": "Romance",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2020
    },
    {
        "title": "Vikram",
        "genre": "Action",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2022
    },
    {
        "title": "Don",
        "genre": "Comedy",
        "imdb_rating": 7.1,
        "poster": "",
        "year": 2022
    },
    {
        "title": "Love Today",
        "genre": "Romance",
        "imdb_rating": 8.1,
        "poster": "",
        "year": 2022
    },
    {
        "title": "Beast",
        "genre": "Action",
        "imdb_rating": 5.2,
        "poster": "",
        "year": 2022
    },
    {
        "title": "Doctor",
        "genre": "Comedy",
        "imdb_rating": 7.6,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Kaithi",
        "genre": "Action",
        "imdb_rating": 8.5,
        "poster": "",
        "year": 2019
    },
    {
        "title": "Sarpatta Parambarai",
        "genre": "Drama",
        "imdb_rating": 8.7,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Mandela",
        "genre": "Comedy",
        "imdb_rating": 8.4,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Nenjam Marappathillai",
        "genre": "Horror",
        "imdb_rating": 7.2,
        "poster": "",
        "year": 2021
    },
    {
        "title": "Kanaa",
        "genre": "Drama",
        "imdb_rating": 7.7,
        "poster": "",
        "year": 2018
    },
    {
        "title": "Maanadu",
        "genre": "Thriller",
        "imdb_rating": 8.3,
        "poster": "",
        "year": 2021
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies');
        console.log('Connected to MongoDB');

        // Clear existing movies (optional)
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Remove duplicates based on title and year
        const uniqueMovies = [];
        const seen = new Set();
        
        for (const movie of tamilMovies) {
            const key = `${movie.title}-${movie.year}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueMovies.push(movie);
            }
        }

        // Insert movies
        const insertedMovies = await Movie.insertMany(uniqueMovies);
        console.log(`Inserted ${insertedMovies.length} movies successfully`);

        // Display some statistics
        const totalMovies = await Movie.countDocuments();
        const genreStats = await Movie.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log(`\nDatabase Statistics:`);
        console.log(`Total movies: ${totalMovies}`);
        console.log(`\nMovies by genre:`);
        genreStats.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count}`);
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

// Run the seed function
seedDatabase();
