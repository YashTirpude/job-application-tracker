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
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
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

export const getApplications = createAsyncThunk(
  "applications/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) return rejectWithValue("No token");

    try {
      const res = await api.get("/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
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
        state.applications = action.payload;
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
      });
  },
});

export const { setApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
