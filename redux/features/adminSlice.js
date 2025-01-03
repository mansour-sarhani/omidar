import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: {},
    status: 'idle',
};

export const ADMIN_GET_ALL_USERS = createAsyncThunk(
    'admin/ADMIN_GET_ALL_USERS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/user');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_USER_BY_ID = createAsyncThunk(
    'admin/ADMIN_GET_USER_BY_ID',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/user?userId=' + userId);
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_ADD_USER = createAsyncThunk(
    'admin/ADMIN_ADD_USER',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post('/api/admin/user', formData, {
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

export const ADMIN_UPDATE_USER = createAsyncThunk(
    'admin/ADMIN_UPDATE_USER',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/admin/user?userId=' + data.userId,
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

export const ADMIN_GET_ALL_CLIENTS = createAsyncThunk(
    'admin/ADMIN_GET_ALL_CLIENTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/client');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_CLIENT_BY_ID = createAsyncThunk(
    'admin/ADMIN_GET_CLIENT_BY_ID',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await http.get(
                '/api/admin/client?clientId=' + clientId
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

export const ADMIN_ADD_CLIENT = createAsyncThunk(
    'admin/ADMIN_ADD_CLIENT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post('/api/admin/client', formData, {
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

export const ADMIN_UPDATE_CLIENT = createAsyncThunk(
    'admin/ADMIN_UPDATE_CLIENT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/admin/client?clientId=' + data.clientId,
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

export const ADMIN_GET_ALL_COUNTRIES = createAsyncThunk(
    'admin/ADMIN_GET_ALL_COUNTRIES',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/country');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_ALL_DOCUMENT_TEMPLATES = createAsyncThunk(
    'admin/ADMIN_GET_ALL_DOCUMENT_TEMPLATES',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/template');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder;

        //ADMIN_GET_ALL_USERS
        handleAsyncActions(builder, ADMIN_GET_ALL_USERS);

        //ADMIN_GET_USER_BY_ID
        handleAsyncActions(builder, ADMIN_GET_USER_BY_ID);

        //ADMIN_ADD_USER
        handleAsyncActions(builder, ADMIN_ADD_USER);

        //ADMIN_UPDATE_USER
        handleAsyncActions(builder, ADMIN_UPDATE_USER);

        //ADMIN_GET_ALL_CLIENTS
        handleAsyncActions(builder, ADMIN_GET_ALL_CLIENTS);

        //ADMIN_GET_CLIENT_BY_ID
        handleAsyncActions(builder, ADMIN_GET_CLIENT_BY_ID);

        //ADMIN_ADD_CLIENT
        handleAsyncActions(builder, ADMIN_ADD_CLIENT);

        //ADMIN_UPDATE_CLIENT
        handleAsyncActions(builder, ADMIN_UPDATE_CLIENT);

        //ADMIN_GET_ALL_COUNTRIES
        handleAsyncActions(builder, ADMIN_GET_ALL_COUNTRIES);

        //ADMIN_GET_ALL_DOCUMENT_TEMPLATES
        handleAsyncActions(builder, ADMIN_GET_ALL_DOCUMENT_TEMPLATES);
    },
});

export default adminSlice.reducer;
