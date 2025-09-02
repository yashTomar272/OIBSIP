
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,       // ✅ disables that slow check warning
      serializableCheck: false     // optional: disables serializable warnings too
    }),
});

export default store;
