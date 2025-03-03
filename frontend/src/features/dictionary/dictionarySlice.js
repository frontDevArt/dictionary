import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../constants";

const API_URL = `${BASE_URL}/api/dictionaries`;

// Fetch Single Dictionary
export const fetchSingleDictionary = createAsyncThunk(
  "dictionary/fetchOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch Dictionaries
export const fetchDictionaries = createAsyncThunk(
  "dictionary/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create Dictionary
export const createDictionary = createAsyncThunk(
  "dictionary/create",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update Dictionary
export const updateDictionary = createAsyncThunk(
  "dictionary/update",
  async ({ id, data, deleteRowIds = [] }, thunkAPI) => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        { ...data, deleteRowIds },
        {
          headers: {
            Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
          },
        }
      );

      await thunkAPI.dispatch(fetchSingleDictionary(id));

      return thunkAPI.getState().dictionary.selectedDictionary;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete Dictionary
export const deleteDictionary = createAsyncThunk(
  "dictionary/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dictionarySlice = createSlice({
  name: "dictionary",
  initialState: {
    dictionaries: [],
    selectedDictionary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDictionaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDictionaries.fulfilled, (state, action) => {
        state.loading = false;
        state.dictionaries = action.payload;
      })
      .addCase(fetchDictionaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchSingleDictionary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleDictionary.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDictionary = action.payload;
      })
      .addCase(fetchSingleDictionary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createDictionary.fulfilled, (state, action) => {
        state.dictionaries.push(action.payload);
      })
      .addCase(updateDictionary.fulfilled, (state, action) => {
        const updatedDictionary = action.payload;

        // Update the dictionary in Redux state
        const index = state.dictionaries.findIndex(
          (d) => d._id === updatedDictionary._id
        );
        if (index !== -1) {
          state.dictionaries[index] = updatedDictionary;
        } else {
          state.dictionaries.push(updatedDictionary);
        }

        // Ensure `selectedDictionary` is updated
        if (state.selectedDictionary?._id === updatedDictionary._id) {
          state.selectedDictionary = updatedDictionary;
        }
      })
      .addCase(deleteDictionary.fulfilled, (state, action) => {
        state.dictionaries = state.dictionaries.filter(
          (d) => d._id !== action.payload
        );
      });
  },
});

export const selectDictionaryById = (state, id) =>
  state.dictionary.dictionaries.find((dict) => dict._id === id) ||
  state.dictionary.selectedDictionary;

export default dictionarySlice.reducer;
