import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: false,
        userData: null as User | null,
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
});


export const { login, logout } = authSlice.actions;

// exporting the reducer form from authSlice
export default authSlice.reducer;