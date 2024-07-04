import { createSlice } from "@reduxjs/toolkit";

const streamSlice = createSlice({
    name: 'stream',
    initialState: {
        status: false,
        streamData: null as any,
        streamId: null as string | null
    },
    reducers: {
        startStream: (state, action) => {
            state.status = true;
            state.streamData = action.payload.streamData;
            state.streamId = action.payload.streamId;
        },
        stopStream: (state) => {
            state.status = false;
            state.streamData = null;
            state.streamId = null;
        }
    }
});

export const { startStream, stopStream } = streamSlice.actions;

export default streamSlice.reducer;
