import { ADMIN_FILTER_CLIENTS } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminFilterClients(dispatch, enqueueSnackbar, setState, data) {
    try {
        const result = await dispatch(ADMIN_FILTER_CLIENTS(data));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminFilterClients;
