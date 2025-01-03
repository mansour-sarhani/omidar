import Cookies from 'js-cookie';

async function clientLogout(enqueueSnackbar, router) {
    try {
        const cookieKeys = ['om_token'];

        cookieKeys.forEach((key) => {
            Cookies.remove(key);
        });

        router.push('/panel/login?logout=success');
    } catch (err) {
        const errorMessage = err.message;

        enqueueSnackbar(errorMessage || 'متاسفانه مشکلی پیش آمده است.', {
            variant: 'error',
        });
    }
}

export default clientLogout;
