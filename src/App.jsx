import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchInput, setSearchInput] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); 
  const [year, setYear] = useState(""); 
  const [type, setType] = useState(""); 
  const [totalResults, setTotalResults] = useState(0); 
  const [error, setError] = useState(""); 
const [showYearDropdown, setShowYearDropdown] = useState(false);
const [tempYear, setTempYear] = useState("");

  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [detailsLoading, setDetailsLoading] = useState(false);

  const API_KEY = "52545257"; 


  const fetchMovies = async (currentPage = page, customTerm = searchTerm) => {
    if (!customTerm) return;

    setLoading(true);
    setError("");

    try {
      const url = `https://www.omdbapi.com/?s=${customTerm}&page=${currentPage}&y=${year}&type=${type}&apikey=${API_KEY}`;
      const res = await axios.get(url);

      if (res.data.Response === "True") {
        setMovies(res.data.Search);
        setTotalResults(parseInt(res.data.totalResults));
        setError("");
      } else {
        setMovies([]);
        setTotalResults(0);
        setError("No movies found");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };


  const handleSearch = (e) => {
    if (e) e.preventDefault(); 

    if (!searchInput.trim()) return;

    const newTerm = searchInput.trim();
    setSearchTerm(newTerm);
    setPage(1);
    setHasSearched(false);
    setMovies([]);
    setSelectedMovie(null); 

    fetchMovies(1, newTerm);
  };


const totalPages = Math.ceil(totalResults / 10); 


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", 
  });
};

const goToPreviousPage = () => {
  if (page > 1) {
    setPage(page - 1);
    setSelectedMovie(null);
    scrollToTop(); 
  }
};

const goToNextPage = () => {
  if (page < totalPages) {
    setPage(page + 1);
    setSelectedMovie(null);
    scrollToTop(); 
  }
};


  const handleMovieClick = async (imdbID) => {
    setSelectedMovie(null);
    setDetailsLoading(true);

    try {
      const url = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`;
      const res = await axios.get(url);
      if (res.data.Response === "True") {
        setSelectedMovie(res.data); 
      }
    } catch (err) {
      console.error("Error fetching movie details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchMovies(page, searchTerm);
    }
    
  }, [page, year, type]);

  
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f9fafb",
        padding: "20px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
          🎬 Movie Search App
        </h1>
        <p style={{ textAlign: "center", marginBottom: "20px", opacity: 0.8 }}>
          Search movies, filter, and open full details by clicking a movie.
        </p>

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              padding: "10px",
              width: "60%",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#16a34a";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(34,197,94,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#22c55e";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0,0,0,0.2)";
              }
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: loading ? "#86efac" : "#22c55e",
              color: "#0f172a",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transform: "scale(1)",
              transition: "all 0.25s ease-in-out",
              boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
      
{/* YEAR FILTER — Click to Open Dropdown with Typing Option */}
<div style={{ position: "relative" }}>
  <button
    onClick={() => setShowYearDropdown(!showYearDropdown)}
    style={{
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #4b5563",
      backgroundColor: "#020617",
      color: "#f9fafb",
      cursor: "pointer",
      transition: "all 0.25s ease-in-out",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.border = "1px solid #22c55e";
      e.currentTarget.style.boxShadow =
        "0 0 8px rgba(34,197,94,0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.border = "1px solid #4b5563";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {year ? year : "All Years"}
  </button>

  {showYearDropdown && (
    <div
      style={{
        position: "absolute",
        top: "110%",
        left: "0",
        backgroundColor: "#0f172a",
        border: "1px solid #22c55e",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
        zIndex: 10,
        width: "200px",
      }}
    >
      <p
        style={{
          marginBottom: "6px",
          fontSize: "14px",
          opacity: 0.9,
        }}
      >
        Enter a year:
      </p>

      <input
        type="number"
        value={tempYear}
        onChange={(e) => setTempYear(e.target.value)}
        placeholder="Type year"
        min="1900"
        max="2099"
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #4b5563",
          backgroundColor: "#020617",
          color: "#f9fafb",
          marginBottom: "10px",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => {
            setYear(tempYear);
            setPage(1);
            setSelectedMovie(null);
            setShowYearDropdown(false);
          }}
          style={{
            backgroundColor: "#22c55e",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            color: "#0f172a",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
        >
          Apply
        </button>

        <button
          onClick={() => setShowYearDropdown(false)}
          style={{
            backgroundColor: "#ef4444",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            color: "#f9fafb",
            fontWeight: "600",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>


          <select
            value={type}
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
              setSelectedMovie(null);
            }}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#f9fafb",
              cursor: "pointer",
              transition: "all 0.25s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid #22c55e";
              e.currentTarget.style.boxShadow =
                "0 0 8px rgba(34,197,94,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid #4b5563";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>

        {!selectedMovie && (
          <>
            {loading && (
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                Loading movies...
              </p>
            )}

            {!loading && hasSearched && error && (
              <p
                style={{
                  textAlign: "center",
                  color: "#f97316",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}

            {!loading && hasSearched && movies.length === 0 && !error && (
              <p style={{ textAlign: "center", opacity: 0.8 }}>
                No movies found for your search.
              </p>
            )}

            {totalResults > 0 && (
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  opacity: 0.8,
                }}
              >
                Showing page {page} of {totalPages} — Total results:{" "}
                {totalResults}
              </p>
            )}

        
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleMovieClick(movie.imdbID)}
                  style={{
                    transition: "all 0.25s ease-in-out",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(34,197,94,0.3)";
                    e.currentTarget.style.border = "1px solid #22c55e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.border = "1px solid #1e293b";
                  }}
                >
                  <div style={{ height: "260px", overflow: "hidden" }}>
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={movie.Title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>
                      {movie.Title}
                    </h3>
                    <p style={{ fontSize: "14px", opacity: 0.8 }}>
                      Year: {movie.Year}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        opacity: 0.7,
                        marginTop: "4px",
                      }}
                    >
                      Type: {movie.Type?.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {movies.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
              <button
  onClick={goToPreviousPage}
  disabled={page === 1}
  onMouseEnter={(e) => {
    if (e.currentTarget.disabled) return; 
    e.currentTarget.style.backgroundColor = "#16a34a"; 
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow =
      "0 6px 12px rgba(34,197,94,0.4)";
  }}
  onMouseLeave={(e) => {
    if (e.currentTarget.disabled) return;
    e.currentTarget.style.backgroundColor = "#22c55e";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor:
      page === 1 ? "#4b5563" : "#22c55e",
    color: "#0f172a",
    fontWeight: "600",
    cursor:
      page === 1 ? "not-allowed" : "pointer",
    transition: "all 0.25s ease-in-out",
    transform: "scale(1)",
  }}
>
  Previous
</button>


                <span
                  style={{
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  Page {page} of {totalPages || 1}
                </span>

               <button
  onClick={goToNextPage}
  disabled={page === totalPages || totalPages === 0}
  onMouseEnter={(e) => {
    if (e.currentTarget.disabled) return;
    e.currentTarget.style.backgroundColor = "#16a34a";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow =
      "0 6px 12px rgba(34,197,94,0.4)";
  }}
  onMouseLeave={(e) => {
    if (e.currentTarget.disabled) return;
    e.currentTarget.style.backgroundColor = "#22c55e";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor:
      page === totalPages || totalPages === 0
        ? "#4b5563"
        : "#22c55e",
    color: "#0f172a",
    fontWeight: "600",
    cursor:
      page === totalPages || totalPages === 0
        ? "not-allowed"
        : "pointer",
    transition: "all 0.25s ease-in-out",
    transform: "scale(1)",
  }}
>
  Next
</button>

              </div>
            )}
          </>
        )}

        {selectedMovie && (
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <button
  onClick={() => setSelectedMovie(null)}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#d1d5db";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow =
      "0 6px 12px rgba(209,213,219,0.4)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#e5e7eb";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    marginBottom: "15px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.25s ease-in-out",
  }}
>
  ← Back
</button>


            {detailsLoading ? (
              <p style={{ textAlign: "center" }}>
                Loading movie details...
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 220px) minmax(0, 1fr)",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                }}
              >
                
                <div
                  style={{
                    width: "100%",
                    maxWidth: "220px",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      selectedMovie.Poster &&
                      selectedMovie.Poster !== "N/A"
                        ? selectedMovie.Poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={selectedMovie.Title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                
                <div>
                  <h2 style={{ fontSize: "22px", marginBottom: "6px" }}>
                    {selectedMovie.Title} ({selectedMovie.Year})
                  </h2>
                  {selectedMovie.Genre && (
                    <p style={{ opacity: 0.85 }}>
                      Genre: {selectedMovie.Genre}
                    </p>
                  )}
                  {selectedMovie.Director && (
                    <p style={{ opacity: 0.85 }}>
                      Director: {selectedMovie.Director}
                    </p>
                  )}
                  {selectedMovie.Actors && (
                    <p style={{ opacity: 0.85 }}>
                      Cast: {selectedMovie.Actors}
                    </p>
                  )}
                  {selectedMovie.Plot && (
                    <p
                      style={{
                        fontSize: "14px",
                        marginTop: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      {selectedMovie.Plot}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
