import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/functions/httpService';
import { handleAsyncActions } from '@/utils/handleAsyncActions';

const initialState = {
    data: null,
    status: 'idle',
};

export const CREATE_CONTRACT = createAsyncThunk(
    'contract/CREATE_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post('/api/contract', formData, {
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

export const UPDATE_CONTRACT = createAsyncThunk(
    'contract/UPDATE_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract?contractId=' + data.contractId,
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

export const GET_ALL_CONTRACTS = createAsyncThunk(
    'contract/GET_ALL_CONTRACTS',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/api/contract');
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const GET_CONTRACT_BY_ID = createAsyncThunk(
    'contract/GET_CONTRACT_BY_ID',
    async (contractId, { rejectWithValue }) => {
        try {
            const response = await http.get(
                '/api/contract?contractId=' + contractId
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

export const GET_CONTRACT_BY_CONTRACT_NO = createAsyncThunk(
    'contract/GET_CONTRACT_BY_CONTRACT_NO',
    async (contractNo, { rejectWithValue }) => {
        try {
            const response = await http.get(
                '/api/contract?contractNo=' + contractNo
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

export const GET_CONTRACT_BY_CLIENT_ID = createAsyncThunk(
    'contract/GET_CONTRACT_BY_CLIENT_ID',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await http.get(
                '/api/contract?clientId=' + clientId
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

export const GET_CONTRACT_DATA_BY_TYPE = createAsyncThunk(
    'contract/GET_CONTRACT_DATA_BY_TYPE',
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.get(
                '/api/contract?type=' +
                    data.type +
                    '&contractId=' +
                    data.contractId
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

export const ADD_USER_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_USER_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/user?contractId=' + data.contractId,
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

export const REMOVE_USER_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_USER_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/user?contractId=' + data.contractId,
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

export const ADD_DOCUMENT_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_DOCUMENT_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/document?contractId=' + data.contractId,
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

export const UPDATE_DOCUMENT = createAsyncThunk(
    'contract/UPDATE_DOCUMENT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/document?contractId=' +
                    data.contractId +
                    '&action=update',
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

export const REMOVE_DOCUMENT_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_DOCUMENT_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/document?contractId=' +
                    data.contractId +
                    '&action=remove',
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

export const ADD_COMMENT_TO_DOCUMENT = createAsyncThunk(
    'contract/ADD_COMMENT_TO_DOCUMENT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/document?contractId=' +
                    data.contractId +
                    '&action=comment',
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

export const ADD_OFFER_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_OFFER_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/offer?contractId=' + data.contractId,
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

export const UPDATE_OFFER = createAsyncThunk(
    'contract/UPDATE_OFFER',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/offer?contractId=' +
                    data.contractId +
                    '&action=update',
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

export const REMOVE_OFFER_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_OFFER_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/offer?contractId=' +
                    data.contractId +
                    '&action=remove',
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

export const ADD_VISA_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_VISA_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/visa?contractId=' + data.contractId,
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

export const UPDATE_VISA = createAsyncThunk(
    'contract/UPDATE_VISA',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/visa?contractId=' +
                    data.contractId +
                    '&action=update',
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

export const REMOVE_VISA_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_VISA_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/visa?contractId=' +
                    data.contractId +
                    '&action=remove',
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

export const ADD_PICKUP_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_PICKUP_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/pickup?contractId=' + data.contractId,
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

export const UPDATE_PICKUP = createAsyncThunk(
    'contract/UPDATE_PICKUP',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/pickup?contractId=' +
                    data.contractId +
                    '&action=update',
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

export const REMOVE_PICKUP_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_PICKUP_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/pickup?contractId=' +
                    data.contractId +
                    '&action=remove',
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

export const ADD_PAYMENT_TO_CONTRACT = createAsyncThunk(
    'contract/ADD_PAYMENT_TO_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.post(
                '/api/contract/payment?contractId=' + data.contractId,
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

export const UPDATE_PAYMENT = createAsyncThunk(
    'contract/UPDATE_PAYMENT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/payment?contractId=' +
                    data.contractId +
                    '&action=update',
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

export const REMOVE_PAYMENT_FROM_CONTRACT = createAsyncThunk(
    'contract/REMOVE_PAYMENT_FROM_CONTRACT',
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            const response = await http.put(
                '/api/contract/payment?contractId=' +
                    data.contractId +
                    '&action=remove',
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

export const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder;

        //CREATE_CONTRACT
        handleAsyncActions(builder, CREATE_CONTRACT);

        //UPDATE_CONTRACT
        handleAsyncActions(builder, UPDATE_CONTRACT);

        //GET_ALL_CONTRACTS
        handleAsyncActions(builder, GET_ALL_CONTRACTS);

        //GET_CONTRACT_BY_ID
        handleAsyncActions(builder, GET_CONTRACT_BY_ID);

        //GET_CONTRACT_BY_CONTRACT_NO
        handleAsyncActions(builder, GET_CONTRACT_BY_CONTRACT_NO);

        //GET_CONTRACT_BY_CLIENT_ID
        handleAsyncActions(builder, GET_CONTRACT_BY_CLIENT_ID);

        //GET_CONTRACT_DATA_BY_TYPE
        handleAsyncActions(builder, GET_CONTRACT_DATA_BY_TYPE);

        //ADD_USER_TO_CONTRACT
        handleAsyncActions(builder, ADD_USER_TO_CONTRACT);

        //REMOVE_USER_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_USER_FROM_CONTRACT);

        //ADD_DOCUMENT_TO_CONTRACT
        handleAsyncActions(builder, ADD_DOCUMENT_TO_CONTRACT);

        //UPDATE_DOCUMENT
        handleAsyncActions(builder, UPDATE_DOCUMENT);

        //REMOVE_DOCUMENT_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_DOCUMENT_FROM_CONTRACT);

        //ADD_COMMENT_TO_DOCUMENT
        handleAsyncActions(builder, ADD_COMMENT_TO_DOCUMENT);

        //ADD_OFFER_TO_CONTRACT
        handleAsyncActions(builder, ADD_OFFER_TO_CONTRACT);

        //UPDATE_OFFER
        handleAsyncActions(builder, UPDATE_OFFER);

        //REMOVE_OFFER_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_OFFER_FROM_CONTRACT);

        //ADD_VISA_TO_CONTRACT
        handleAsyncActions(builder, ADD_VISA_TO_CONTRACT);

        //UPDATE_VISA
        handleAsyncActions(builder, UPDATE_VISA);

        //REMOVE_VISA_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_VISA_FROM_CONTRACT);

        //ADD_PICKUP_TO_CONTRACT
        handleAsyncActions(builder, ADD_PICKUP_TO_CONTRACT);

        //UPDATE_PICKUP
        handleAsyncActions(builder, UPDATE_PICKUP);

        //REMOVE_PICKUP_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_PICKUP_FROM_CONTRACT);

        //ADD_PAYMENT_TO_CONTRACT
        handleAsyncActions(builder, ADD_PAYMENT_TO_CONTRACT);

        //UPDATE_PAYMENT
        handleAsyncActions(builder, UPDATE_PAYMENT);

        //REMOVE_PAYMENT_FROM_CONTRACT
        handleAsyncActions(builder, REMOVE_PAYMENT_FROM_CONTRACT);
    },
});

export default contractSlice.reducer;
