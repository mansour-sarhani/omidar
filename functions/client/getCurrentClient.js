import { GET_CURRENT_CLIENT } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getCurrentClient(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_CURRENT_CLIENT());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
        setState(false);
    }
}

export default getCurrentClient;
