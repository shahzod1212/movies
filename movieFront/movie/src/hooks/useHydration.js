import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { get } from "idb-keyval";
import { setCredentialsMovie } from "../redux/movieSlice";
import { setCredentialsUser } from "../redux/userSlice";
import { setCredentialsRoom } from "../redux/roomSlice";
import { setCredentialsShowtime } from "../redux/showtimeSlice";
import { setCredentialsSeat } from "../redux/seatSlice";
import { setCredentialsBooking } from "../redux/bookingSlice";

const useHydration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      const [
        movies,
        filteredMovie,
        selectedMovie,
        movieCount,
        user,
        token,
        id,
        rooms,
        selectedRoom,
        showtimes,
        filteredShowtimes,
        selectedShowtime,
        availableRooms,
        showtimeCount,
        seats,
        bookings,
        filteredBookings,
        selectedBooking,
      ] = await Promise.all([
        get("movies"),
        get("filteredMovie"),
        get("selectedMovie"),
        get("movieCount"),
        get("user"),
        get("token"),
        get("id"),
        get("rooms"),
        get("selectedRoom"),
        get("showtimes"),
        get("filteredShowtimes"),
        get("selectedShowtime"),
        get("availableRooms"),
        get("showtimeCount"),
        get("seats"),
        get("bookings"),
        get("filteredBookings"),
        get("selectedBooking"),
      ]);

      dispatch(
        setCredentialsMovie({
          movies: movies ?? [],
          filteredMovie: filteredMovie ?? [],
          selectedMovie: selectedMovie ?? null,
          count: movieCount ?? 0,
        }),
      );

      dispatch(
        setCredentialsUser({
          user: user ?? null,
          token: token ?? "",
          id: id ?? 0,
        }),
      );

      dispatch(
        setCredentialsRoom({
          rooms: rooms ?? [],
          selectedRoom: selectedRoom ?? null,
        }),
      );

      dispatch(
        setCredentialsShowtime({
          showtimes: showtimes ?? [],
          filteredShowtimes: filteredShowtimes ?? [],
          selectedShowtime: selectedShowtime ?? null,
          availableRooms: availableRooms ?? [],
          count: showtimeCount ?? 0,
        }),
      );

      dispatch(
        setCredentialsSeat({
          seats: seats ?? [],
        }),
      );

      dispatch(
        setCredentialsBooking({
          bookings: bookings ?? [],
          filteredBookings: filteredBookings ?? [],
          selectedBooking: selectedBooking ?? null,
        }),
      );
    };

    hydrate();
  }, [dispatch]);
};

export default useHydration;
