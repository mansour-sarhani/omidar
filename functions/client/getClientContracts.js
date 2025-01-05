import { GET_CLIENT_CONTRACTS } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getClientContracts(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_CLIENT_CONTRACTS());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getClientContracts;
