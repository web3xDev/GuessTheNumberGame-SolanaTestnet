import { configureStore } from "@reduxjs/toolkit";
import balanceReducer from "./slices/BalanceFetchSlice";
import withdrawReducer from "./slices/WithdrawSlice";
import prizeReducer from "./slices/PrizeSlice";
import balanceUpdateReducer from "./slices/TotalBalanceSlice";

export const store = configureStore({
  reducer: {
    balanceFetch: balanceReducer,
    withdraw: withdrawReducer,
    prize: prizeReducer,
    totalBalance: balanceUpdateReducer,
  },
});
