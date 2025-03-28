// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import sitesReducer from './sites-slice';
import alertsReducer from './alerts-slice';
import tasksReducer from './tasks-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sites: sitesReducer,
    alerts: alertsReducer,
    tasks: tasksReducer,
  },
  // Add middleware and other options as needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;