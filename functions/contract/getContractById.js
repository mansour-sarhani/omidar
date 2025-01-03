import { GET_CONTRACT_BY_ID } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getContractById(
    dispatch,
    enqueueSnackbar,
    setState,
    contractId
) {
    try {
        const result = await dispatch(GET_CONTRACT_BY_ID(contractId));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getContractById;
