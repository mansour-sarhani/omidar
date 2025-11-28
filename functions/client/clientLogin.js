import { CLIENT_LOGIN } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { setAuthCookies } from '@/utils/cookieUtils';

async function clientLogin(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(CLIENT_LOGIN(data));
        const response = unwrapResult(result);

        const clientData = {
            om_token: response.token,
            refresh_token: response.refreshToken,
        };

        setAuthCookies(clientData, {
            om_token: 30,
            refresh_token: 60,
            });

        router.push('/panel/dashboard?login=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientLogin;
