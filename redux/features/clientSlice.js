import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: null,
    status: 'idle',
};

export const GET_CURRENT_CLIENT = createAsyncThunk(
    'client/GET_CURRENT_CLIENT',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/client');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const CLIENT_UPDATE_PROFILE = createAsyncThunk(
    'client/CLIENT_UPDATE_PROFILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put('/api/client/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const CLIENT_LOGIN = createAsyncThunk(
    'client/CLIENT_LOGIN',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/auth/login?type=client',
                formData
            );
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder;

        //GET_CURRENT_CLIENT
        handleAsyncActions(builder, GET_CURRENT_CLIENT);

        //CLIENT_UPDATE_PROFILE
        handleAsyncActions(builder, CLIENT_UPDATE_PROFILE);

        //CLIENT_LOGIN
        handleAsyncActions(builder, CLIENT_LOGIN);
    },
});

export default clientSlice.reducer;
