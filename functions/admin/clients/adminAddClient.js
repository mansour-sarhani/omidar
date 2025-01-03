import { ADMIN_ADD_CLIENT } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminAddClient(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADMIN_ADD_CLIENT(data));
        const response = unwrapResult(result);

        enqueueSnackbar('متقاضی جدید با موفقیت ساخته شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminAddClient;
