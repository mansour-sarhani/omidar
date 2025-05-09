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

export const CLIENT_UPLOAD_VISA_FILE = createAsyncThunk(
    'client/CLIENT_UPLOAD_VISA_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/client/visa?contractId=' + data.contractId,
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

export const CLIENT_REMOVE_VISA_FILE = createAsyncThunk(
    'client/CLIENT_REMOVE_VISA_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/client/visa?contractId=' + data.contractId,
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

export const CLIENT_UPLOAD_TICKET_FILE = createAsyncThunk(
    'client/CLIENT_UPLOAD_TICKET_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/client/pickup?contractId=' + data.contractId,
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

export const CLIENT_REMOVE_TICKET_FILE = createAsyncThunk(
    'client/CLIENT_REMOVE_TICKET_FILE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/client/pickup?contractId=' + data.contractId,
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

export const CLIENT_CREATE_TICKET = createAsyncThunk(
    'client/CLIENT_CREATE_TICKET',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/client/ticket/new',
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

export const CLIENT_REPLY_TO_TICKET = createAsyncThunk(
    'client/CLIENT_REPLY_TO_TICKET',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/client/ticket/?ticketId=' + data.ticketId,
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

export const GET_CLIENT_TICKETS = createAsyncThunk(
    'client/GET_CLIENT_TICKETS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/client/ticket?status=${data.status}&page=${data.page}&limit=${data.limit}`
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

export const CLIENT_GET_TICKET_BY_NUMBER = createAsyncThunk(
    'client/CLIENT_GET_TICKET_BY_NUMBER',
    async (ticketNo, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/client/ticket?ticketNo=${ticketNo}`
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

        //CLIENT_UPLOAD_VISA_FILE
        handleAsyncActions(builder, CLIENT_UPLOAD_VISA_FILE);

        //CLIENT_REMOVE_VISA_FILE
        handleAsyncActions(builder, CLIENT_REMOVE_VISA_FILE);

        //CLIENT_UPLOAD_TICKET_FILE
        handleAsyncActions(builder, CLIENT_UPLOAD_TICKET_FILE);

        //CLIENT_REMOVE_TICKET_FILE
        handleAsyncActions(builder, CLIENT_REMOVE_TICKET_FILE);

        //CLIENT_CREATE_TICKET
        handleAsyncActions(builder, CLIENT_CREATE_TICKET);

        //CLIENT_REPLY_TO_TICKET
        handleAsyncActions(builder, CLIENT_REPLY_TO_TICKET);

        //GET_CLIENT_TICKETS
        handleAsyncActions(builder, GET_CLIENT_TICKETS);

        //CLIENT_GET_TICKET_BY_NUMBER
        handleAsyncActions(builder, CLIENT_GET_TICKET_BY_NUMBER);
    },
});

export default clientSlice.reducer;
