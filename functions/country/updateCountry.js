import { UPDATE_COUNTRY } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function updateCountry(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(UPDATE_COUNTRY(data));
        const response = unwrapResult(result);

        enqueueSnackbar('اطلاعات کشور به روزرسانی شد', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default updateCountry;
