import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set } from "idb-keyval";
import {
  getAllRooms,
  getRoomById,
  getRoomByName,
  getRoomsByType,
} from "../axios/apis";

const initialState = {
  rooms: [],
  selectedRoom: null,
  status: "idle",
  error: null,
};

export const fetchAllRoomsStore = createAsyncThunk(
  "room/fetchAllRoom",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRooms();

      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the rooms");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRoomById = createAsyncThunk(
  "room/fetchRoomById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRoomById(id);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the room by id.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRoomByName = createAsyncThunk(
  "room/fetchRoomByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await getRoomByName(name);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch the room by name.");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRoomsByType = createAsyncThunk(
  "room/fetchRoomsByType",
  async (roomType, { rejectWithValue }) => {
    try {
      const response = await getRoomsByType(roomType);
      return response.data;
    } catch (err) {
      toast.error("Something went wrong. Cannot fetch rooms by type.");
      return rejectWithValue(err.message);
    }
  },
);

const roomSlice = createSlice({
  name: "room",
  initialState: initialState,
  reducers: {
    setCredentialsRoom: (state, action) => {
      state.rooms = action.payload.rooms;
      state.selectedRoom = action.payload.selectedRoom;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllRoomsStore.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllRoomsStore.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.rooms = action.payload;

      set("rooms", JSON.parse(JSON.stringify(state.rooms)));
    });
    builder.addCase(fetchAllRoomsStore.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchRoomById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRoomById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedRoom = action.payload;

      set("selectedRoom", JSON.parse(JSON.stringify(state.selectedRoom)));
    });
    builder.addCase(fetchRoomById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchRoomByName.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRoomByName.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedRoom = action.payload;

      set("selectedRoom", JSON.parse(JSON.stringify(state.selectedRoom)));
    });
    builder.addCase(fetchRoomByName.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchRoomsByType.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRoomsByType.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.rooms = action.payload;

      set("rooms", JSON.parse(JSON.stringify(state.rooms)));
    });
    builder.addCase(fetchRoomsByType.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { setCredentialsRoom } = roomSlice.actions;
export default roomSlice.reducer;
