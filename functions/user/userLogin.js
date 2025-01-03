import { USER_LOGIN } from '@/redux/features/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

async function userLogin(dispatch, enqueueSnackbar, router, data) {
    try {
        const result = await dispatch(USER_LOGIN(data));
        const response = unwrapResult(result);

        const userData = {
            om_token: response.token,
        };
        for (let key in userData) {
            Cookies.set(key, userData[key], {
                expires: 30,
                secure: true,
                sameSite: 'Lax',
            });
        }

        router.push('/admin/dashboard?login=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userLogin;
