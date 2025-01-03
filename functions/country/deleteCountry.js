import { DELETE_COUNTRY } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function deleteCountry(dispatch, enqueueSnackbar, countryId) {
    try {
        const result = await dispatch(DELETE_COUNTRY(countryId));
        const response = unwrapResult(result);

        enqueueSnackbar('کشور با موفقیت حذف شد.', {
            variant: 'success',
        });
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default deleteCountry;
