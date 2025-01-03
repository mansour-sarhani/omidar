import { GET_CONTRACT_DATA_BY_TYPE } from '@/redux/features/contractSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function getContractDataByType(
    dispatch,
    enqueueSnackbar,
    setState,
    data
) {
    try {
        const result = await dispatch(GET_CONTRACT_DATA_BY_TYPE(data));
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default getContractDataByType;
