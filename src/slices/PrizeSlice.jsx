import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const PrizeSlice = createSlice({
  name: "prize",
  initialState,
  reducers: {
    setStatePrizeFetch: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setStatePrizeFetch } = PrizeSlice.actions;

export default PrizeSlice.reducer;
