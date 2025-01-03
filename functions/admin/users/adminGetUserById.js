import { ADMIN_GET_USER_BY_ID } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminGetUserById(dispatch, enqueueSnackbar, setState, userId) {
    try {
        const result = await dispatch(ADMIN_GET_USER_BY_ID(userId));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminGetUserById;
