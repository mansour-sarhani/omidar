import { ADMIN_GET_DASHBOARD_TICKETS } from '@/redux/features/adminSlice';
import { unwrapResult } from '@reduxjs/toolkit';

async function adminGetDashboardTickets(dispatch, enqueueSnackbar, setState) {
    try {
        const result = await dispatch(ADMIN_GET_DASHBOARD_TICKETS());
        const response = unwrapResult(result);

        setState(response.data);
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default adminGetDashboardTickets;
