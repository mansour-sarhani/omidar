import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: null,
    clientData: null,
    status: 'idle',
    isLoggedIn: false,
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

export const GET_CLIENT_CONTRACTS = createAsyncThunk(
    'client/GET_CLIENT_CONTRACTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/client/contract');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const GET_CLIENT_NOTIFICATIONS = createAsyncThunk(
    'client/GET_CLIENT_NOTIFICATIONS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/client/notification?type=${data.type}&page=${data.page}&limit=${data.limit}`
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

export const GET_CLIENT_UNREAD_NOTIFICATIONS = createAsyncThunk(
    'client/GET_CLIENT_UNREAD_NOTIFICATIONS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get(`/api/client/notification/unread`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const CLIENT_READ_NOTIFICATION = createAsyncThunk(
    'client/CLIENT_READ_NOTIFICATION',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await http.put(
                `/api/client/notification?notificationId=` + notificationId
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

export const CLIENT_UPLOAD_FILE = createAsyncThunk(
    'client/CLIENT_UPLOAD_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/client/document?contractId=' + data.contractId,
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

export const CLIENT_REMOVE_FILE = createAsyncThunk(
    'client/CLIENT_REMOVE_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/client/document?contractId=' + data.contractId,
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
        builder
            //GET_CURRENT_CLIENT
            .addCase(GET_CURRENT_CLIENT.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(GET_CURRENT_CLIENT.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.clientData = action.payload.data;
                state.isLoggedIn = true;
            })
            .addCase(GET_CURRENT_CLIENT.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        //CLIENT_UPDATE_PROFILE
        handleAsyncActions(builder, CLIENT_UPDATE_PROFILE);

        //CLIENT_LOGIN
        handleAsyncActions(builder, CLIENT_LOGIN);

        //GET_CLIENT_CONTRACTS
        handleAsyncActions(builder, GET_CLIENT_CONTRACTS);

        //GET_CLIENT_NOTIFICATIONS
        handleAsyncActions(builder, GET_CLIENT_NOTIFICATIONS);

        //GET_CLIENT_UNREAD_NOTIFICATIONS
        handleAsyncActions(builder, GET_CLIENT_UNREAD_NOTIFICATIONS);

        //CLIENT_READ_NOTIFICATION
        handleAsyncActions(builder, CLIENT_READ_NOTIFICATION);

        //CLIENT_UPLOAD_FILE
        handleAsyncActions(builder, CLIENT_UPLOAD_FILE);

        //CLIENT_REMOVE_FILE
        handleAsyncActions(builder, CLIENT_REMOVE_FILE);
    },
});

export default clientSlice.reducer;
