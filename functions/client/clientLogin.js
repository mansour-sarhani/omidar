import { CLIENT_LOGIN } from '@/redux/features/clientSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

async function clientLogin(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(CLIENT_LOGIN(data));
        const response = unwrapResult(result);

        const clientData = {
            om_token: response.token,
        };
        for (let key in clientData) {
            Cookies.set(key, clientData[key], {
                expires: 30,
                secure: true,
                sameSite: 'Lax',
            });
        }

        router.push('/panel/dashboard?login=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientLogin;
