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

export const ADMIN_FILTER_CLIENTS = createAsyncThunk(
    'admin/ADMIN_FILTER_CLIENTS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/admin/client/search?firstName=${data.firstName}&lastName=${data.lastName}&email=${data.email}&mobile=${data.mobile}`
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

export const ADMIN_GET_ALL_DOCUMENTS = createAsyncThunk(
    'admin/ADMIN_GET_ALL_DOCUMENTS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/admin/document?status=${data.status}&page=${data.page}&limit=${data.limit}`
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

export const ADMIN_GET_ALL_VISAS = createAsyncThunk(
    'admin/ADMIN_GET_ALL_VISAS',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                `/api/admin/visa?status=${data.status}&page=${data.page}&limit=${data.limit}`
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

export const ADMIN_GET_DASHBOARD_USERS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_USERS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/user');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_CLIENTS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_CLIENTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/client');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_CONTRACTS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_CONTRACTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/contract');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_DOCUMENTS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_DOCUMENTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/document');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_VISAS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_VISAS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/visa');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_TICKETS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_TICKETS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/ticket');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADMIN_GET_DASHBOARD_STATS = createAsyncThunk(
    'admin/ADMIN_GET_DASHBOARD_STATS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/admin/dashboard/stats');
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

        //ADMIN_FILTER_CLIENTS
        handleAsyncActions(builder, ADMIN_FILTER_CLIENTS);

        //ADMIN_GET_ALL_COUNTRIES
        handleAsyncActions(builder, ADMIN_GET_ALL_COUNTRIES);

        //ADMIN_GET_ALL_DOCUMENTS
        handleAsyncActions(builder, ADMIN_GET_ALL_DOCUMENTS);

        //ADMIN_GET_ALL_VISAS
        handleAsyncActions(builder, ADMIN_GET_ALL_VISAS);

        //ADMIN_GET_ALL_DOCUMENT_TEMPLATES
        handleAsyncActions(builder, ADMIN_GET_ALL_DOCUMENT_TEMPLATES);

        //ADMIN_GET_DASHBOARD_USERS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_USERS);

        //ADMIN_GET_DASHBOARD_CLIENTS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_CLIENTS);

        //ADMIN_GET_DASHBOARD_CONTRACTS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_CONTRACTS);

        //ADMIN_GET_DASHBOARD_DOCUMENTS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_DOCUMENTS);

        //ADMIN_GET_DASHBOARD_VISAS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_VISAS);

        //ADMIN_GET_DASHBOARD_TICKETS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_TICKETS);

        //ADMIN_GET_DASHBOARD_STATS
        handleAsyncActions(builder, ADMIN_GET_DASHBOARD_STATS);
    },
});

export default adminSlice.reducer;
