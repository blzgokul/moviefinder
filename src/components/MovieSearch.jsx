
import { useState } from "react";
import { searchMovies, getMovieDetails } from "../services/api";
import MovieCard from "./MovieCard";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setSelectedMovie(null);

    const results = await searchMovies(query.trim());
    if (results.length === 0) {
      setError("No movies found. Try another name.");
    }
    setMovies(results);
    setLoading(false);
  };

  const handleMovieClick = async (movie, e) => {
    e.stopPropagation(); 
    setLoading(true);
    const details = await getMovieDetails(movie.imdbID);
    setSelectedMovie(details);
    setLoading(false);
  };

  return (
    <div className="movie-search-container">
      <h1 className="app-title">🎬 Movie Search App</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p className="info-text">Loading...</p>}
      {error && !loading && <p className="error-text">{error}</p>}

      {/* ✅ Show movie grid only when no movie details are open */}
      {!loading && movies.length > 0 && !selectedMovie && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={(e) => handleMovieClick(movie, e)}
            />
          ))}
        </div>
      )}

      {/* ✅ Show selected movie details below */}
      {selectedMovie && (
        <div className="movie-details">
          <h2>{selectedMovie.Title}</h2>
          <div className="movie-details-content">
            <img
              src={
                selectedMovie.Poster && selectedMovie.Poster !== "N/A"
                  ? selectedMovie.Poster
                  : "https://via.placeholder.com/300x445?text=No+Image"
              }
              alt={selectedMovie.Title}
            />
            <div className="movie-details-text">
              <p>
                <strong>Year:</strong> {selectedMovie.Year}
              </p>
              <p>
                <strong>Genre:</strong> {selectedMovie.Genre}
              </p>
              <p>
                <strong>Runtime:</strong> {selectedMovie.Runtime}
              </p>
              <p>
                <strong>IMDB Rating:</strong> {selectedMovie.imdbRating}
              </p>
              <p>
                <strong>Plot:</strong> {selectedMovie.Plot}
              </p>
              <p>
                <strong>Actors:</strong> {selectedMovie.Actors}
              </p>
              <button
                className="close-details-btn"
                onClick={() => setSelectedMovie(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
