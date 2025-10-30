import { configureStore } from "@reduxjs/toolkit";
import taskSlice from "./taskSlice";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    tasks: taskSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  // devTools: process.env.NODE_ENV !== "production",
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
