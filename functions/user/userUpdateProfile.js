import { USER_UPDATE_PROFILE } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function userUpdateProfile(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(USER_UPDATE_PROFILE(data));
        const response = unwrapResult(result);

        enqueueSnackbar('پرفایل با موفقت به روز رسانی شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userUpdateProfile;
