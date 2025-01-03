import { GET_ALL_DOCUMENT_TEMPLATES } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getAllDocTemplates(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_ALL_DOCUMENT_TEMPLATES());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getAllDocTemplates;
