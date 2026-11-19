import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { injectStore } from "../axios/axios";
import movieReducer from "./movieSlice";
import roomReducer from "./roomSlice";
import showtimeReducer from "./showtimeSlice";
import seatReducer from "./seatSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movie: movieReducer,
    room: roomReducer,
    showtime: showtimeReducer,
    seat: seatReducer,
    booking: bookingReducer,
  },
});

injectStore(store);

export default store;
