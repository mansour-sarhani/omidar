import { GET_CONTRACT_BY_CLIENT_ID } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getContractByClientId(
    dispatch,
    enqueueSnackbar,
    setState,
    clientId
) {
    try {
        const result = await dispatch(GET_CONTRACT_BY_CLIENT_ID(clientId));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getContractByClientId;
