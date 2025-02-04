import { CLIENT_UPDATE_PROFILE } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function clientUpdateProfile(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(CLIENT_UPDATE_PROFILE(data));
        const response = unwrapResult(result);

        enqueueSnackbar('پروفایل با موفقیت به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientUpdateProfile;
