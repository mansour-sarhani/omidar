import { ADMIN_GET_ALL_DOCUMENT_TEMPLATES } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminGetAllDocTemplates(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(ADMIN_GET_ALL_DOCUMENT_TEMPLATES());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminGetAllDocTemplates;
