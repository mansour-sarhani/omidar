import { UPDATE_VISA } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateVisa(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_VISA(data));
        const response = unwrapResult(result);

        enqueueSnackbar('ویزا به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateVisa;
