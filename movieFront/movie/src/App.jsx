import React from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";
import useHydration from "./hooks/useHydration";
import RoomDetails from "./pages/RoomDetails";
import MovieDetails from "./pages/MovieDetails";
import MoviePage from "./pages/MoviePage";
import ShowtimePage from "./pages/ShowtimePage";
import ShowtimeDetails from "./pages/ShowtimeDetails";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import ProtectedAdmin from "./security/ProtectedAdmin";
import ProtectedRoutes from "./security/ProtectedRoutes";

const App = () => {
  useHydration();
  return (
    <div>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/showtime/:id" element={<ShowtimeDetails />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/showtimes" element={<ShowtimePage />} />
          <Route path="/booking/success" element={<SuccessPage />} />
          <Route path="/booking/cancel" element={<CancelPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminPage />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
