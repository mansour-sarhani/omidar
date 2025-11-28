import { removeAllAuthCookies } from '@/utils/cookieUtils';

async function clientLogout(enqueueSnackbar, router) {
    try {
        removeAllAuthCookies();

        router.push('/auth/client/login?logout=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientLogout;
