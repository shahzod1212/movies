import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set } from "idb-keyval";
import {
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByDate,
  getShowtimesByMovieId,
  getShowtimesByRoomAndDate,
  getShowtimesByDateRange,
  getAvailableRooms,
  countDistinctMoviesByDate,
} from "../axios/apis";

const initialState = {
  showtimes: [],
  filteredShowtimes: [],
  selectedShowtime: null,
  availableRooms: [],
  count: 0,
  status: "idle",
  error: null,
};

export const fetchAllShowtime = createAsyncThunk(
  "showtime/fetchAllShowtime",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllShowtimes();
      return response.data;
    } catch (err) {
      toast.error(
        "Something went wrong. We will fix the error as quickly as possible",
      );
      return rejectWithValue(err.message);
    }
  },
);

export const fetchShowtimeById = createAsyncThunk(
  "showtime/fetchShowtimeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getShowtimeById(id);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the showtime by id.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchShowtimesByDate = createAsyncThunk(
  "showtime/fetchShowtimesByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await getShowtimesByDate(date);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch showtimes by date.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchShowtimesByMovieId = createAsyncThunk(
  "showtime/fetchShowtimesByMovieId",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await getShowtimesByMovieId(movieId);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch showtimes by movie.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchShowtimesByRoomAndDate = createAsyncThunk(
  "showtime/fetchShowtimesByRoomAndDate",
  async ({ roomId, date }, { rejectWithValue }) => {
    try {
      const response = await getShowtimesByRoomAndDate(roomId, date);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch showtimes by room.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchShowtimesByDateRange = createAsyncThunk(
  "showtime/fetchShowtimesByDateRange",
  async ({ start, end }, { rejectWithValue }) => {
    try {
      const response = await getShowtimesByDateRange(start, end);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch showtimes by range.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAvailableRooms = createAsyncThunk(
  "showtime/fetchAvailableRooms",
  async (date, { rejectWithValue }) => {
    try {
      const response = await getAvailableRooms(date);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch available rooms.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchCountDistinctMoviesByDate = createAsyncThunk(
  "showtime/fetchCountDistinctMoviesByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await countDistinctMoviesByDate(date);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot count movies by date.");
      return rejectWithValue(err.message);
    }
  },
);

const showtimeSlice = createSlice({
  name: "showtime",
  initialState: initialState,
  reducers: {
    setCredentialsShowtime: (state, action) => {
      state.showtimes = action.payload.showtimes;
      state.count = action.payload.count;
      state.filteredShowtimes = action.payload.filteredShowtimes;
      state.selectedShowtime = action.payload.selectedShowtime;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllShowtime.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllShowtime.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.showtimes = action.payload;

      set("showtimes", JSON.parse(JSON.stringify(state.showtimes)));
    });
    builder.addCase(fetchAllShowtime.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchShowtimeById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchShowtimeById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedShowtime = action.payload;

      set(
        "selectedShowtime",
        JSON.parse(JSON.stringify(state.selectedShowtime)),
      );
    });
    builder.addCase(fetchShowtimeById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchShowtimesByDate.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchShowtimesByDate.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredShowtimes = action.payload;

      set(
        "filteredShowtimes",
        JSON.parse(JSON.stringify(state.filteredShowtimes)),
      );
    });
    builder.addCase(fetchShowtimesByDate.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchShowtimesByMovieId.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchShowtimesByMovieId.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredShowtimes = action.payload;

      set(
        "filteredShowtimes",
        JSON.parse(JSON.stringify(state.filteredShowtimes)),
      );
    });
    builder.addCase(fetchShowtimesByMovieId.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchShowtimesByRoomAndDate.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchShowtimesByRoomAndDate.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredShowtimes = action.payload;

      set(
        "filteredShowtimes",
        JSON.parse(JSON.stringify(state.filteredShowtimes)),
      );
    });
    builder.addCase(fetchShowtimesByRoomAndDate.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchShowtimesByDateRange.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchShowtimesByDateRange.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredShowtimes = action.payload;

      set(
        "filteredShowtimes",
        JSON.parse(JSON.stringify(state.filteredShowtimes)),
      );
    });
    builder.addCase(fetchShowtimesByDateRange.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchAvailableRooms.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAvailableRooms.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.availableRooms = action.payload;

      set("availableRooms", JSON.parse(JSON.stringify(state.availableRooms)));
    });
    builder.addCase(fetchAvailableRooms.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchCountDistinctMoviesByDate.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      fetchCountDistinctMoviesByDate.fulfilled,
      (state, action) => {
        state.status = "succeeded";
        state.count = action.payload;

        set("showtimeCount", JSON.parse(JSON.stringify(state.count)));
      },
    );
    builder.addCase(
      fetchCountDistinctMoviesByDate.rejected,
      (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      },
    );
  },
});

export const { setCredentialsShowtime } = showtimeSlice.actions;
export default showtimeSlice.reducer;
