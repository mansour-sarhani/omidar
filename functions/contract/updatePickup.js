import { UPDATE_PICKUP } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updatePickup(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_PICKUP(data));
        const response = unwrapResult(result);

        enqueueSnackbar('پیکاپ به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updatePickup;
