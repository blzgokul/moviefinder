// src/services/api.js
import axios from "axios";

// Put your OMDb API key here
const API_KEY = "52545257"; // ← replace this
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query) {
  if (!query) return [];

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: query,   // "s" = search by title
        type: "movie",
      },
    });

    if (response.data.Response === "True") {
      return response.data.Search; // array of movies
    } else {
      return []; // no movies found
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export async function getMovieDetails(imdbID) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: imdbID, // "i" = search by IMDb ID
        plot: "full",
      },
    });

    if (response.data.Response === "True") {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
