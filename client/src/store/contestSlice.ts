import { createSlice } from "@reduxjs/toolkit";

const contestSlice = createSlice({
    name: 'contest',
    initialState: {
        customContestCookie: null as string | null,
        isOngoingContest: false,
    },
    reducers: {
        setContestData: (state, action) => {
            state.customContestCookie = action.payload.customContestCookie;
            if (action.payload.customContestCookie) {
                state.isOngoingContest = true;
            } else {
                state.isOngoingContest = false;
            }
        }
    }
});

export const { setContestData } = contestSlice.actions;

export default contestSlice.reducer;