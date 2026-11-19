import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "../components/AdminDashboard";
import CreateMovieForm from "../components/CreateMovieForm";
import CreateRoomForm from "../components/CreateRoomForm";
import CreateShowtimeForm from "../components/CreateShowtimeForm";
import NowPlaying from "../components/NowPlaying";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovies } from "../redux/movieSlice";
import { fetchAllBooking } from "../redux/bookingSlice";
import { fetchAllRoomsStore } from "../redux/roomSlice";
import { fetchAllShowtime } from "../redux/showtimeSlice";

const AdminPage = () => {
  const [view, setView] = useState("Dashboard");
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.movies);
  const rooms = useSelector((state) => state.room.rooms);
  const showtimes = useSelector((state) => state.showtime.filteredShowtimes);

  function handleView(label) {
    setView(label);
  }

  useEffect(() => {
    dispatch(fetchAllMovies());
    dispatch(fetchAllRoomsStore());
    dispatch(fetchAllShowtime());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AdminSidebar activeView={view} onSelect={handleView} />

      <div className="ml-64 px-8 py-8">
        {view === "Dashboard" && <AdminDashboard onSelect={handleView} />}
        {view === "Create Movie" && <CreateMovieForm />}
        {view === "Create Room" && <CreateRoomForm />}
        {view === "Create Showtime" && <CreateShowtimeForm />}
        {view === "Now Playing" && <NowPlaying />}
      </div>
    </div>
  );
};

export default AdminPage;
