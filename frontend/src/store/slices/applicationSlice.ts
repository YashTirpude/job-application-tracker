import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import api from "../../services/api";

export interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  description: string;
  dateApplied: string;
  status: string;
  jobPlatform: string;
  jobUrl: string;
  resumeUrl: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
  hasNextPage: true,
};

export const addApplication = createAsyncThunk<
  Application,
  { formData: FormData; token: string },
  { rejectValue: string }
>("applications/addApplication", async ({ formData, token }, thunkAPI) => {
  try {
    const res = await api.post("/applications", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Submission failed"
    );
  }
});

export const deleteApplication = createAsyncThunk<
  string,
  { id: string; token: string },
  { rejectValue: string }
>("applications/deleteApplication", async ({ id, token }, thunkAPI) => {
  try {
    await api.delete(`/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to delete application"
    );
  }
});

export const getApplications = createAsyncThunk<
  { applications: Application[]; hasNextPage: boolean },
  { page: number; limit: number },
  { state: RootState; rejectValue: string }
>(
  "applications/fetchAll",
  async ({ page, limit }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) return rejectWithValue("No token");

    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });
      return {
        applications: res.data.applications,
        hasNextPage: res.data.hasNextPage,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplications(state, action: PayloadAction<Application[]>) {
      state.applications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        // Reset on page 1, append otherwise
        state.applications =
          action.meta.arg.page === 1
            ? action.payload.applications
            : [...state.applications, ...action.payload.applications];
        state.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
