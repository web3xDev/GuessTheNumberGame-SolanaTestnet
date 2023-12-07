import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const WithdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    activateWithdraw: (state) => {
      state.value = true;
    },

    deActivateWithdraw: (state) => {
      state.value = false;
    },
  },
});

export const { activateWithdraw, deActivateWithdraw } = WithdrawSlice.actions;

export default WithdrawSlice.reducer;
