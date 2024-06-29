import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        //TODO: add more slices here for posts
    }
});


export default store;