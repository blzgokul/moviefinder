// src/components/MovieCard.jsx
/* eslint-disable react/prop-types */
function MovieCard({ movie, onClick }) {
  const { Title, Year, Poster, Type } = movie;

  const posterSrc =
    Poster && Poster !== "N/A"
      ? Poster
      : "https://via.placeholder.com/300x445?text=No+Image";

  return (
    <div
      className="movie-card"
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        backgroundColor: "#1f2937",
      }}
    >
      <img
        src={posterSrc}
        alt={Title}
        style={{ width: "100%", height: "360px", objectFit: "cover" }}
      />
      <div style={{ padding: "10px", color: "white" }}>
        <h3 style={{ marginBottom: "4px" }}>{Title}</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
          {Year} • {Type?.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
