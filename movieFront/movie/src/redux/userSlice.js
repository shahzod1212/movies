import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { set, del } from "idb-keyval";
import { login, refreshUserRefreshToken, register } from "../axios/apis";

const initialState = {
  user: null,
  id: 0,
  token: "",
  status: "idle",
  error: null,
};

export const fetchRegisterUser = createAsyncThunk(
  "user/fetchregisterUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await register(body);

      return response.data;
    } catch (err) {
      toast.error(
        "Something went wrong. Please register again with all filled fields",
      );
      return rejectWithValue(err.message);
    }
  },
);

export const fetchLoginUser = createAsyncThunk(
  "user/fetchLoginUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await login(body);

      return response.data;
    } catch (err) {
      toast.error("Please login again. Something went wrong");
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRefreshToken = createAsyncThunk(
  "user/fetchRefreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await refreshUserRefreshToken(refreshToken);

      return response.data;
    } catch (err) {
      toast.error("Unauthorized login. Please go back and log in again");
      return rejectWithValue(err.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCredentialsUser: (state, action) => {
      state.user = action.payload.user;
      state.id = action.payload.id;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.id = 0;
      state.token = "";
      state.status = "idle";
      state.error = null;

      del("user");
      del("token");
      del("id");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRegisterUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRegisterUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.id = action.payload.user.id;
      state.token = action.payload.token;

      set("user", JSON.parse(JSON.stringify(state.user)));
      set("token", JSON.parse(JSON.stringify(state.token)));
      set("id", JSON.parse(JSON.stringify(state.id)));
    });
    builder.addCase(fetchRegisterUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchLoginUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchLoginUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.id = action.payload.user.id;
      state.token = action.payload.token;

      set("user", JSON.parse(JSON.stringify(state.user)));
      set("token", JSON.parse(JSON.stringify(state.token)));
      set("id", JSON.parse(JSON.stringify(state.id)));
    });
    builder.addCase(fetchLoginUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    builder.addCase(fetchRefreshToken.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.id = action.payload.user.id;
      state.token = action.payload.token;

      set("user", JSON.parse(JSON.stringify(state.user)));
      set("token", JSON.parse(JSON.stringify(state.token)));
      set("id", JSON.parse(JSON.stringify(state.id)));
    });
    builder.addCase(fetchRefreshToken.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { setCredentialsUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
