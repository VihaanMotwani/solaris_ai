// src/store/sites-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sitesService } from '../lib/api';

interface Site {
  id: string;
  name: string;
  capacity: number;
  alerts: number;
  location?: { lat: number; lng: number };
  installationDate?: string;
  lastMaintenance?: string;
  performance?: number;
}

interface SitesState {
  sites: Site[];
  currentSite: Site | null;
  loading: boolean;
  error: string | null;
}

const initialState: SitesState = {
  sites: [],
  currentSite: null,
  loading: false,
  error: null,
};

export const fetchSites = createAsyncThunk(
  'sites/fetchSites',
  async (_, { rejectWithValue }) => {
    try {
      return await sitesService.getSites();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchSiteById = createAsyncThunk(
  'sites/fetchSiteById',
  async (siteId: string, { rejectWithValue }) => {
    try {
      return await sitesService.getSiteById(siteId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSiteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSite = action.payload;
      })
      .addCase(fetchSiteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sitesSlice.reducer;