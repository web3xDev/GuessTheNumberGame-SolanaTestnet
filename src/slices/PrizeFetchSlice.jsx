import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const PrizeFetchSlice = createSlice({
  name: "prizeFetch",
  initialState,
  reducers: {
    activatePrizeFetch: (state) => {
      state.value = true;
    },
  },
});

export const { setStatePrizeFetch } = PrizeFetchSlice.actions;

export default PrizeFetchSlice.reducer;
