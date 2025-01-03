import { UPDATE_OFFER } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateOffer(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_OFFER(data));
        const response = unwrapResult(result);

        enqueueSnackbar('آفر به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateOffer;
