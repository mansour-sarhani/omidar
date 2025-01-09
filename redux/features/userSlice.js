import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: null,
    userData: null,
    role: null,
    status: 'idle',
};

export const GET_CURRENT_USER = createAsyncThunk(
    'user/GET_CURRENT_USER',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/user');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const USER_UPDATE_PROFILE = createAsyncThunk(
    'user/USER_UPDATE_PROFILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put('/api/user', formData, {
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

export const USER_LOGIN = createAsyncThunk(
    'user/USER_LOGIN',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/auth/login?type=user',
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

export const GET_USER_NOTIFICATIONS = createAsyncThunk(
    'user/GET_USER_NOTIFICATIONS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/user/notification?type=${data.type}&page=${data.page}&limit=${data.limit}`
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

export const USER_READ_NOTIFICATION = createAsyncThunk(
    'user/USER_READ_NOTIFICATION',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await http.put(
                `/api/user/notification?notificationId=` + notificationId
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //GET_CURRENT_USER
            .addCase(GET_CURRENT_USER.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(GET_CURRENT_USER.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userData = action.payload.data;
                state.role = action.payload.data.role;
            })
            .addCase(GET_CURRENT_USER.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        //USER_UPDATE_PROFILE
        handleAsyncActions(builder, USER_UPDATE_PROFILE);

        //USER_LOGIN
        handleAsyncActions(builder, USER_LOGIN);

        //GET_USER_NOTIFICATIONS
        handleAsyncActions(builder, GET_USER_NOTIFICATIONS);

        //USER_READ_NOTIFICATION
        handleAsyncActions(builder, USER_READ_NOTIFICATION);
    },
});

export default userSlice.reducer;
