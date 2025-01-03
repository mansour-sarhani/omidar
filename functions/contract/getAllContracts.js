import { GET_ALL_CONTRACTS } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getAllContracts(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(GET_ALL_CONTRACTS());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getAllContracts;
