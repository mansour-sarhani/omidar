'use client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import ClientLoginForm from '@/components/forms/ClientLoginForm';
import useCommonHooks from '@/hooks/useCommonHooks';
import IsLoading from '@/components/common/IsLoading';

export default function ClientLoginPage() {
    const [token, setToken] = useState(null);
    const { searchParams, enqueueSnackbar, router } = useCommonHooks();

    const logout = searchParams.get('logout');

    const currentToken = Cookies.get('om_token');

    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/client/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

    useEffect(() => {
        setToken(currentToken);

        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.type === 'client') {
                router.replace('/panel/dashboard');
            }
        }
    }, [currentToken, router, token]);

    if (token === null) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="inner-page auth-page">
            <div className="auth-page-container">
                <div className="auth-page-box">
                    <ClientLoginForm />
                </div>
            </div>
        </div>
    );
}
