import { ADMIN_GET_ALL_VISAS } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminGetAllVisas(
    dispatch,
    enqueueSnackbar,
    setState,
    setTotal,
    data
) {
    try {
        const result = await dispatch(ADMIN_GET_ALL_VISAS(data));
        const response = unwrapResult(result);

        setTotal(response.total);
        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminGetAllVisas;
