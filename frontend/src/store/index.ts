import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import applicationReducer from "./slices/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
