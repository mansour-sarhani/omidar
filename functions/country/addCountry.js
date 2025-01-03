import { ADD_COUNTRY } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function addCountry(dispatch, enqueueSnackbar, data) {
    try {
        const result = await dispatch(ADD_COUNTRY(data));
        const response = unwrapResult(result);

        enqueueSnackbar('کشور جدید با موفقیت اضافه شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default addCountry;
