import { createSlice } from "@reduxjs/toolkit";

const contestSlice = createSlice({
    name: 'contest',
    initialState: {
        customContestCookie: null as string | null,
        isOngoingContest: false,
        contestId: null as number | null
    },
    reducers: {
        setContestData: (state, action) => {
            state.customContestCookie = action.payload.customContestCookie;
            state.contestId = action.payload.contestId;
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