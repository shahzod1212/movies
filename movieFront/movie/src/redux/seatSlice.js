import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set } from "idb-keyval";
import { getSeatsByRoom } from "../axios/apis";

const initialState = {
  seats: [],
  status: "idle",
  error: null,
};

export const fetchSeatsByRoom = createAsyncThunk(
  "seat/fetchSeatsByRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await getSeatsByRoom(roomId);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch seats for this room.");
      return rejectWithValue(err.message);
    }
  },
);

const seatSlice = createSlice({
  name: "seat",
  initialState: initialState,
  reducers: {
    setCredentialsSeat: (state, action) => {
      state.seats = action.payload.seats;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeatsByRoom.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchSeatsByRoom.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.seats = action.payload;

      set("seats", JSON.parse(JSON.stringify(state.seats)));
    });
    builder.addCase(fetchSeatsByRoom.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { setCredentialsSeat } = seatSlice.actions;
export default seatSlice.reducer;
