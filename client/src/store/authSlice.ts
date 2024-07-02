import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/user";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: false,
        userData: null as User | null,
        accessToken: null as string | null
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.accessToken = null;
        }
    }
});


export const { login, logout } = authSlice.actions;

// exporting the reducer form from authSlice
export default authSlice.reducer;