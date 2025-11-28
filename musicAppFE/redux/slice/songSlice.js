import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/apiConfig";

const initialState = {
    list: [],
    status: "idle",
    error: null,
};

// GET LIST SONGS
export const fetchSongs = createAsyncThunk(
    "songs/fetch",
    async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/songs`);
            if (!res.ok) {
                throw new Error(`Fetch songs failed: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
);

export const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSongs.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSongs.fulfilled, (state, action) => {
                state.status = "success";
                state.list = action.payload;
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export const songReducer = songSlice.reducer;
