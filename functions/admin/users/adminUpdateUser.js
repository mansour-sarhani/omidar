import { ADMIN_UPDATE_USER } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminUpdateUser(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADMIN_UPDATE_USER(data));
        const response = unwrapResult(result);

        enqueueSnackbar('اطلاعات کاربر به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminUpdateUser;
