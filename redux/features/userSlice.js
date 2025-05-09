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

export const GET_USER_UNREAD_NOTIFICATIONS = createAsyncThunk(
    'user/GET_USER_UNREAD_NOTIFICATIONS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get(`/api/user/notification/unread`);
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

export const USER_CREATE_TICKET = createAsyncThunk(
    'user/USER_CREATE_TICKET',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post('/api/user/ticket/new', formData, {
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

export const USER_REPLY_TO_TICKET = createAsyncThunk(
    'user/USER_REPLY_TO_TICKET',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/user/ticket/?ticketId=' + data.ticketId,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
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

export const USER_GET_ALL_TICKETS = createAsyncThunk(
    'user/USER_GET_ALL_TICKETS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/user/ticket?status=${data.status}&page=${data.page}&limit=${data.limit}`
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

export const USER_GET_TICKET_BY_NUMBER = createAsyncThunk(
    'user/USER_GET_TICKET_BY_NUMBER',
    async (ticketNo, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/user/ticket?ticketNo=${ticketNo}`
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

        //GET_USER_UNREAD_NOTIFICATIONS
        handleAsyncActions(builder, GET_USER_UNREAD_NOTIFICATIONS);

        //USER_READ_NOTIFICATION
        handleAsyncActions(builder, USER_READ_NOTIFICATION);

        //USER_CREATE_TICKET
        handleAsyncActions(builder, USER_CREATE_TICKET);

        //USER_REPLY_TO_TICKET
        handleAsyncActions(builder, USER_REPLY_TO_TICKET);

        //USER_GET_ALL_TICKETS
        handleAsyncActions(builder, USER_GET_ALL_TICKETS);

        //USER_GET_TICKET_BY_NUMBER
        handleAsyncActions(builder, USER_GET_TICKET_BY_NUMBER);
    },
});

export default userSlice.reducer;
