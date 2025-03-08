import { ADMIN_GET_DASHBOARD_VISAS } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminGetDashboardVisas(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(ADMIN_GET_DASHBOARD_VISAS());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminGetDashboardVisas;
