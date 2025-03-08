import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: {},
    status: 'idle',
};

export const CHECK_USER_ENTITY = createAsyncThunk(
    'public/CHECK_USER_ENTITY',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.post('/api/auth/check');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const GET_ALL_COUNTRIES = createAsyncThunk(
    'public/GET_ALL_COUNTRIES',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/country');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADD_COUNTRY = createAsyncThunk(
    'public/ADD_COUNTRY',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post('/api/country', formData, {
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

export const UPDATE_COUNTRY = createAsyncThunk(
    'public/UPDATE_COUNTRY',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/country?countryId=' + data.countryId,
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

export const DELETE_COUNTRY = createAsyncThunk(
    'public/DELETE_COUNTRY',
    async (countryId, { rejectWithValue }) => {
        try {
            const response = await http.delete(
                '/api/country?countryId=' + countryId
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

export const GET_ALL_USERS = createAsyncThunk(
    'public/GET_ALL_USERS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/users');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const ADD_DOCUMENT_TEMPLATE = createAsyncThunk(
    'public/ADD_DOCUMENT_TEMPLATE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/document/template',
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

export const UPDATE_DOCUMENT_TEMPLATE = createAsyncThunk(
    'public/UPDATE_DOCUMENT_TEMPLATE',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/document/template?docTemplateId=' + data.docTemplateId,
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

export const GET_ALL_DOCUMENT_TEMPLATES = createAsyncThunk(
    'public/GET_ALL_DOCUMENT_TEMPLATES',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/document/template');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const DELETE_DOCUMENT_TEMPLATE = createAsyncThunk(
    'public/DELETE_DOCUMENT_TEMPLATE',
    async (docTemplateId, { rejectWithValue }) => {
        try {
            const response = await http.delete(
                '/api/document/template?docTemplateId=' + docTemplateId
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

export const publicSlice = createSlice({
    name: 'public',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder;

        //CHECK_USER_ENTITY
        handleAsyncActions(builder, CHECK_USER_ENTITY);

        //GET_ALL_COUNTRIES
        handleAsyncActions(builder, GET_ALL_COUNTRIES);

        //ADD_COUNTRY
        handleAsyncActions(builder, ADD_COUNTRY);

        //UPDATE_COUNTRY
        handleAsyncActions(builder, UPDATE_COUNTRY);

        //DELETE_COUNTRY
        handleAsyncActions(builder, DELETE_COUNTRY);

        //GET_ALL_USERS
        handleAsyncActions(builder, GET_ALL_USERS);

        //ADD_DOCUMENT_TEMPLATE
        handleAsyncActions(builder, ADD_DOCUMENT_TEMPLATE);

        //UPDATE_DOCUMENT_TEMPLATE
        handleAsyncActions(builder, UPDATE_DOCUMENT_TEMPLATE);

        //GET_ALL_DOCUMENT_TEMPLATES
        handleAsyncActions(builder, GET_ALL_DOCUMENT_TEMPLATES);

        //DELETE_DOCUMENT_TEMPLATE
        handleAsyncActions(builder, DELETE_DOCUMENT_TEMPLATE);
    },
});

export default publicSlice.reducer;
