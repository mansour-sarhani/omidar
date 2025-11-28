import { removeAllAuthCookies } from '@/utils/cookieUtils';

async function userLogout(enqueueSnackbar, router) {
    try {
        removeAllAuthCookies();

        router.push('/auth/admin/login?logout=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default userLogout;
