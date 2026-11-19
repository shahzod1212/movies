import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set } from "idb-keyval";
import {
  getBookingById,
  getMyBookings,
  getMyBookingsByStatus,
} from "../axios/apis";

const initialState = {
  bookings: [],
  filteredBookings: [],
  selectedBooking: null,
  status: "idle",
  error: null,
};

export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getBookingById(id);

      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the booking.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAllBooking = createAsyncThunk(
  "booking/fetchAllBooking",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyBookings();

      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch your bookings.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMyBookingByStatus = createAsyncThunk(
  "booking/fetchMyBookingByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await getMyBookingsByStatus(status);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch bookings by status.");
      return rejectWithValue(err.message);
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: initialState,
  reducers: {
    setCredentialsBooking: (state, action) => {
      state.bookings = action.payload.bookings;
      state.filteredBookings = action.payload.filteredBookings;
      state.selectedBooking = action.payload.selectedBooking;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBooking.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllBooking.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.bookings = action.payload;

      set("bookings", JSON.parse(JSON.stringify(state.bookings)));
    });
    builder.addCase(fetchAllBooking.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchBookingById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchBookingById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedBooking = action.payload;

      set("selectedBooking", JSON.parse(JSON.stringify(state.selectedBooking)));
    });
    builder.addCase(fetchBookingById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchMyBookingByStatus.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMyBookingByStatus.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.filteredBookings = action.payload;

      set(
        "filteredBookings",
        JSON.parse(JSON.stringify(state.filteredBookings)),
      );
    });
    builder.addCase(fetchMyBookingByStatus.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { setCredentialsBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
