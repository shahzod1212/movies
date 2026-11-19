import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

let storeRef;

export const injectStore = (store) => {
  storeRef = store;
};

api.interceptors.request.use((config) => {
  const token = storeRef?.getState().user.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storeRef?.dispatch({ type: "user/logout" });
    }
    return Promise.reject(error);
  },
);

export default api;
