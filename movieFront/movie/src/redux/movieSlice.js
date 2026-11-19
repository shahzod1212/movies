import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set } from "idb-keyval";
import {
  getAllMovies,
  getMovieById,
  searchMoviesByTitle,
  getMoviesByStudio,
  getMoviesByLanguage,
  getMoviesByDirector,
  getMoviesByGenre,
  getMoviesByGenresIn,
  getMoviesByDateBetween,
  getMoviesByMinRating,
  countMoviesByGenre,
  countMoviesByStudio,
} from "../axios/apis";

const initialState = {
  movies: [],
  filteredMovie: [],
  selectedMovie: null,
  keyword: "",
  count: 0,
  status: "idle",
  error: null,
};

export const fetchAllMovies = createAsyncThunk(
  "movie/fetchAllMovies",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getAllMovies(page, size);

      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the movies");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMovieById = createAsyncThunk(
  "movie/fetchMovieById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMovieById(id);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the movie by id.");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchSearchMoviesByTitle = createAsyncThunk(
  "movie/fetchSearchMoviesByTitle",
  async ({ title, page, size }, { rejectWithValue }) => {
    try {
      const response = await searchMoviesByTitle(title, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot search the movies");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByStudio = createAsyncThunk(
  "movie/fetchMoviesByStudio",
  async ({ studio, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByStudio(studio, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by studio");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByLanguage = createAsyncThunk(
  "movie/fetchMoviesByLanguage",
  async ({ language, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByLanguage(language, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by language");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByDirector = createAsyncThunk(
  "movie/fetchMoviesByDirector",
  async ({ director, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByDirector(director, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by director");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByGenre = createAsyncThunk(
  "movie/fetchMoviesByGenre",
  async ({ genre, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByGenre(genre, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by genre");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByGenresIn = createAsyncThunk(
  "movie/fetchMoviesByGenresIn",
  async ({ genres, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByGenresIn(genres, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by genres");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByDateBetween = createAsyncThunk(
  "movie/fetchMoviesByDateBetween",
  async ({ start, end, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByDateBetween(start, end, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by date range");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchMoviesByMinRating = createAsyncThunk(
  "movie/fetchMoviesByMinRating",
  async ({ minRating, page, size }, { rejectWithValue }) => {
    try {
      const response = await getMoviesByMinRating(minRating, page, size);
      return response.data.content;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch movies by rating");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchCountByGenre = createAsyncThunk(
  "movie/fetchCountByGenre",
  async (genre, { rejectWithValue }) => {
    try {
      const response = await countMoviesByGenre(genre);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot count movies by genre");
      return rejectWithValue(err?.message);
    }
  },
);

export const fetchCountByStudio = createAsyncThunk(
  "movie/fetchCountByStudio",
  async (studio, { rejectWithValue }) => {
    try {
      const response = await countMoviesByStudio(studio);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot count movies by studio");
      return rejectWithValue(err?.message);
    }
  },
);

const movieSlice = createSlice({
  name: "movie",
  initialState: initialState,
  reducers: {
    setCredentialsMovie: (state, action) => {
      state.count = action.payload.count;
      state.movies = action.payload.movies;
      state.filteredMovie = action.payload.filteredMovie;
      state.selectedMovie = action.payload.selectedMovie;
    },
    setFilteredMovies: (state, actions) => {
      state.filteredMovie = actions.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllMovies.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllMovies.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.movies = action.payload;

      set("movies", JSON.parse(JSON.stringify(state.movies)));
    });
    builder.addCase(fetchAllMovies.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMovieById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMovieById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedMovie = action.payload;

      set("selectedMovie", JSON.parse(JSON.stringify(state.selectedMovie)));
    });
    builder.addCase(fetchMovieById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchSearchMoviesByTitle.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchSearchMoviesByTitle.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchSearchMoviesByTitle.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByStudio.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByStudio.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByStudio.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByLanguage.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByLanguage.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByLanguage.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByDirector.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByDirector.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByDirector.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByGenre.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByGenre.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByGenresIn.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByGenresIn.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByGenresIn.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByDateBetween.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByDateBetween.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByDateBetween.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMoviesByMinRating.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMoviesByMinRating.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredMovie = action.payload;

      set("filteredMovie", JSON.parse(JSON.stringify(state.filteredMovie)));
    });
    builder.addCase(fetchMoviesByMinRating.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchCountByGenre.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCountByGenre.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.count = action.payload;

      set("movieCount", JSON.parse(JSON.stringify(state.count)));
    });
    builder.addCase(fetchCountByGenre.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchCountByStudio.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCountByStudio.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.count = action.payload;

      set("movieCount", JSON.parse(JSON.stringify(state.count)));
    });
    builder.addCase(fetchCountByStudio.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { setCredentialsMovie, setFilteredMovies, setKeyword } =
  movieSlice.actions;
export default movieSlice.reducer;
