import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import exampleReducer from '../reducers/exampleReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    example: exampleReducer, // optional
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
