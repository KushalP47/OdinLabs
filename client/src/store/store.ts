import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import streamReducer from './streamSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        stream: streamReducer,
        //TODO: add more slices here for posts
    }
});


export default store;