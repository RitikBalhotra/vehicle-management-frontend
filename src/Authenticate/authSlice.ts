import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';

type Role = 'admin' | 'manager' | 'driver' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: { payload: Role }) {
      state.isAuthenticated = true;
      state.role = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
