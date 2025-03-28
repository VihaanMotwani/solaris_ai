// src/store/tasks-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksService } from '../lib/api';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  siteId: string;
  componentId: string;
  description: string;
  priority: number;
  status: TaskStatus;
}

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await tasksService.getTasks();
      // Ensure tasks have the correct status type
      return tasks.map(task => ({
        ...task,
        status: task.status as TaskStatus
      }));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTaskStatusAsync = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status }: { taskId: string; status: TaskStatus }, { rejectWithValue }) => {
    try {
      await tasksService.updateTaskStatus(taskId, status);
      return { id: taskId, status };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
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
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const task = state.items.find(item => item.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const taskIndex = state.items.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          state.items[taskIndex].status = status;
        }
      });
  },
});

export const { setTasks, setLoading, setError, updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;