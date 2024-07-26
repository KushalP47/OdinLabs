import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import streamReducer from './streamSlice';
import contestReducer from './contestSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        stream: streamReducer,
        contest: contestReducer,
        //TODO: add more slices here for posts
    }
});


export default store;