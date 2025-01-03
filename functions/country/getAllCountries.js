import { GET_ALL_COUNTRIES } from '@/redux/features/publicSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getAllCountries(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_ALL_COUNTRIES());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getAllCountries;
