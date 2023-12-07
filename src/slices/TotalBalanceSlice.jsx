import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const TotalBalanceSlice = createSlice({
  name: "totalBalance",
  initialState,
  reducers: {
    setStateTotalBalance: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setStateTotalBalance } = TotalBalanceSlice.actions;

export default TotalBalanceSlice.reducer;
