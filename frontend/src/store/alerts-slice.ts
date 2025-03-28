// src/store/alerts-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { alertsService } from '../lib/api';

export type AlertStatus = 'Active' | 'Resolved' | 'Ignored';

export interface Alert {
  id: string;
  siteId: string;
  componentId: string;
  anomalyType: string;
  severity: number;
  timestamp: string;
  status: AlertStatus;
}

interface AlertsState {
  items: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      return await alertsService.getAlerts();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAlertStatusAsync = createAsyncThunk(
  'alerts/updateStatus',
  async ({ alertId, status }: { alertId: string; status: AlertStatus }, { rejectWithValue }) => {
    try {
      await alertsService.updateAlertStatus(alertId, status);
      return { id: alertId, status };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts(state, action: PayloadAction<Alert[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateAlertStatus(state, action: PayloadAction<{ id: string; status: AlertStatus }>) {
      const alert = state.items.find(item => item.id === action.payload.id);
      if (alert) {
        alert.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAlertStatusAsync.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const alertIndex = state.items.findIndex(alert => alert.id === id);
        if (alertIndex !== -1) {
          state.items[alertIndex].status = status;
        }
      });
  },
});

export const { setAlerts, setLoading, setError, updateAlertStatus } = alertsSlice.actions;
export default alertsSlice.reducer;