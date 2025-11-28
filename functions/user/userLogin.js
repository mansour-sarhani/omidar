import { USER_LOGIN } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { setAuthCookies } from '@/utils/cookieUtils';

async function userLogin(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(USER_LOGIN(data));
        const response = unwrapResult(result);

        const userData = {
            om_token: response.token,
            refresh_token: response.refreshToken,
        };

        setAuthCookies(userData, {
            om_token: 30,
            refresh_token: 60,
        });

        router.push('/admin/dashboard?login=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userLogin;
