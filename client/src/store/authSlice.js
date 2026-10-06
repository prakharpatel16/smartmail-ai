import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi.js';
import { apiError } from '../services/api.js';

export const fetchCurrentUser = createAsyncThunk('auth/me', async () => (await authApi.me()).user);
export const loginUser = createAsyncThunk('auth/login', async (input, { rejectWithValue }) => {
  try { return (await authApi.login(input)).user; } catch (error) { return rejectWithValue(apiError(error, 'Unable to sign in.')); }
});
export const registerUser = createAsyncThunk('auth/register', async (input, { rejectWithValue }) => {
  try { return await authApi.register(input); } catch (error) { return rejectWithValue(apiError(error, 'Unable to create your account.')); }
});
export const verifyEmailUser = createAsyncThunk('auth/verifyEmail', async (input, { rejectWithValue }) => {
  try { return (await authApi.verifyEmail(input)).user; } catch (error) { return rejectWithValue(apiError(error, 'Unable to verify your email.')); }
});
export const resendVerificationCode = createAsyncThunk('auth/resendVerification', async (input, { rejectWithValue }) => {
  try { return await authApi.resendVerification(input); } catch (error) { return rejectWithValue(apiError(error, 'Unable to resend the verification code.')); }
});
export const logoutUser = createAsyncThunk('auth/logout', async () => { await authApi.logout(); });

const authSlice = createSlice({
  name: 'auth', initialState: { user: null, initialized: false, loading: false },
  reducers: { setUser: (state, action) => { state.user = action.payload; state.initialized = true; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.user = action.payload; state.initialized = true; state.loading = false; })
      .addCase(fetchCurrentUser.rejected, (state) => { state.user = null; state.initialized = true; state.loading = false; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.initialized = true; })
      .addCase(verifyEmailUser.fulfilled, (state, action) => { state.user = action.payload; state.initialized = true; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.initialized = true; });
  }
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
