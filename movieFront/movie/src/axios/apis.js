import api from "./axios";

export const register = async (body) => {
  return api.post("/auth/register", body);
};

export const login = async (body) => {
  return api.post("/auth/login", body);
};

export const refreshUserRefreshToken = async (refreshToken) => {
  return api.post("/auth/refresh", null, {
    params: { refreshToken: refreshToken },
  });
};

export const getAllMovies = async (page, size) => {
  return api.get("/api/movies", {
    params: { page: page, size: size },
  });
};

export const getMovieById = async (id) => {
  return api.get(`/api/movies/${id}`);
};

export const searchMoviesByTitle = async (title, page, size) => {
  return api.get("/api/movies/search", {
    params: { title: title, page: page, size: size },
  });
};

export const getMoviesByStudio = async (studio, page, size) => {
  return api.get("/api/movies/studio", {
    params: { studio: studio, page: page, size: size },
  });
};

export const getMoviesByLanguage = async (language, page, size) => {
  return api.get("/api/movies/language", {
    params: { language: language, page: page, size: size },
  });
};

export const getMoviesByDirector = async (director, page, size) => {
  return api.get("/api/movies/director", {
    params: { director: director, page: page, size: size },
  });
};

export const getMoviesByGenre = async (genre, page, size) => {
  return api.get("/api/movies/genre", {
    params: { genre: genre, page: page, size: size },
  });
};

export const getMoviesByGenresIn = async (genres, page, size) => {
  return api.get("/api/movies/genres", {
    params: { genres: genres, page: page, size: size },
  });
};

export const getMoviesByDateBetween = async (start, end, page, size) => {
  return api.get("/api/movies/search-date", {
    params: { start: start, end: end, page: page, size: size },
  });
};

export const getMoviesByMinRating = async (minRating, page, size) => {
  return api.get("/api/movies/rating", {
    params: { minRating: minRating, page: page, size: size },
  });
};

export const countMoviesByGenre = async (genre) => {
  return api.get("/api/movies/count/genre", {
    params: { genre: genre },
  });
};

export const countMoviesByStudio = async (studio) => {
  return api.get("/api/movies/count/studio", {
    params: { studio: studio },
  });
};

export const createRoom = async (body) => {
  return api.post("/api/rooms", body);
};

export const getRoomById = async (id) => {
  return api.get(`/api/rooms/${id}`);
};

export const getAllRooms = async () => {
  return api.get("/api/rooms");
};

export const getRoomByName = async (name) => {
  return api.get("/api/rooms/name", {
    params: { name: name },
  });
};

export const getRoomsByType = async (roomType) => {
  return api.get("/api/rooms/type", {
    params: { roomType: roomType },
  });
};

export const createShowtime = async (body) => {
  return api.post("/api/showtimes", body);
};

export const getShowtimeById = async (id) => {
  return api.get(`/api/showtimes/${id}`);
};

export const getAllShowtimes = async () => {
  return api.get("/api/showtimes");
};

export const deleteShowtime = async (id) => {
  return api.delete(`/api/showtimes/${id}`);
};

export const changeShowtimeStatus = async (id, status) => {
  return api.patch(`/api/showtimes/${id}/status`, null, {
    params: { status: status },
  });
};

export const changeShowtimeMovieStatus = async (id, status) => {
  return api.patch(`/api/showtimes/${id}/movie-status`, null, {
    params: { status: status },
  });
};

export const getShowtimesByDate = async (date) => {
  return api.get("/api/showtimes/date", {
    params: { date: date },
  });
};

export const getShowtimesByMovieId = async (movieId) => {
  return api.get(`/api/showtimes/movie/${movieId}`);
};

export const getShowtimesByRoomAndDate = async (roomId, date) => {
  return api.get(`/api/showtimes/room/${roomId}`, {
    params: { date: date },
  });
};

export const getShowtimesByDateRange = async (start, end) => {
  return api.get("/api/showtimes/range", {
    params: { start: start, end: end },
  });
};

export const getAvailableRooms = async (date) => {
  return api.get("/api/showtimes/available-rooms", {
    params: { date: date },
  });
};

export const countDistinctMoviesByDate = async (date) => {
  return api.get("/api/showtimes/count", {
    params: { date: date },
  });
};

export const getSeatsByRoom = async (roomId) => {
  return api.get(`/api/seats/room/${roomId}`);
};

export const createBooking = async (body) => {
  return api.post("/api/bookings", body);
};

export const confirmBookingPayment = async (sessionId) => {
  return api.post("/api/bookings/confirm", null, {
    params: { sessionId: sessionId },
  });
};

export const getBookingById = async (id) => {
  return api.get(`/api/bookings/${id}`);
};

export const getMyBookings = async () => {
  return api.get("/api/bookings/me");
};

export const getMyBookingsByStatus = async (status) => {
  return api.get("/api/bookings/me/status", {
    params: { status: status },
  });
};

export const cancelBooking = async (id) => {
  return api.patch(`/api/bookings/${id}/cancel`);
};

export const getTakenSeatIds = async (showtimeId) => {
  return api.get(`/api/bookings/showtime/${showtimeId}/taken-seats`);
};

export const countBookedSeatsByShowtime = async (showtimeId) => {
  return api.get(`/api/bookings/showtime/${showtimeId}/count`);
};

export const createMovie = async (body) => {
  return api.post("/api/movies", body);
};

export const deleteMovie = async (id) => {
  return api.delete(`/api/movies/${id}`);
};
