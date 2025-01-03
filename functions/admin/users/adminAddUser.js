import { ADMIN_ADD_USER } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminAddUser(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADMIN_ADD_USER(data));
        const response = unwrapResult(result);

        enqueueSnackbar('کاربر جدید با موفقیت ساخته شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminAddUser;
