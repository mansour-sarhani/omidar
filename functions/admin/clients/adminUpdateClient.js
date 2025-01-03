import { ADMIN_UPDATE_CLIENT } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminUpdateClient(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADMIN_UPDATE_CLIENT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('اطلاعات متقاضی به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminUpdateClient;
