import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const BalanceFetchSlice = createSlice({
  name: "balanceFetch",
  initialState,
  reducers: {
    activateBalanceFetch: (state) => {
      state.value = true;
    },

    deActivateBalanceFetch: (state) => {
      state.value = false;
    },
  },
});

export const { activateBalanceFetch, deActivateBalanceFetch } =
  BalanceFetchSlice.actions;

export default BalanceFetchSlice.reducer;
