import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type ITask, type ITaskStatus } from "@/Interface/task";
import { createTask, deleteTask, getTasks, updateTaskStatus } from "@/api/task";

const initialState: ITask[] = localStorage.getItem("taskman_tasks")
  ? JSON.parse(localStorage.getItem("taskman_tasks") as string)
  : [];

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await getTasks();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (payload: { title: string; description?: string }) => {
    return await createTask(payload.title, payload.description);
  }
);

export const removeTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    return await deleteTask(taskId);
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (payload: {
    id: string;
    title: string;
    status: ITaskStatus;
    description?: string;
  }) => {
    return await updateTaskStatus(payload);
  }
);

export const taskSlice = createSlice({
  name: "/tasks",
  initialState,
  reducers: {
    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state[index].status =
          state[index].status === "PENDING" ? "COMPLETED" : "PENDING";
      }
    },
    clearTasks() {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (_state, action) => {
      const tasks = action.payload.data.data;
      localStorage.setItem("taskman_tasks", JSON.stringify(tasks));
      return tasks;
    });
    builder.addCase(fetchTasks.rejected, () => {
      localStorage.removeItem("taskman_tasks");
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      const newTask: ITask = action.payload.data.data;
      state.push(newTask);
      localStorage.setItem("taskman_tasks", JSON.stringify(state));
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const taskId: string = action.payload.data.data.id;
      const index = state.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        state.splice(index, 1);
        localStorage.setItem("taskman_tasks", JSON.stringify(state));
      }
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask: ITask = action.payload.data.data;
      const index = state.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state[index] = updatedTask;
        localStorage.setItem("taskman_tasks", JSON.stringify(state));
      }
    });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
