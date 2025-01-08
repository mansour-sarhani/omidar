'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import UserLoginForm from '@/components/forms/UserLoginForm';
import { jwtDecode } from 'jwt-decode';
import IsLoading from '@/components/common/IsLoading';

export default function UserLoginPage() {
    const [token, setToken] = useState(null);
    const { enqueueSnackbar, router, searchParams } = useCommonHooks();

    const logout = searchParams.get('logout');

    const currentToken = Cookies.get('om_token');

    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/admin/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

    useEffect(() => {
        setToken(currentToken);

        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.type === 'user') {
                router.replace('/admin/dashboard');
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
                    <UserLoginForm />
                </div>
            </div>
        </div>
    );
}
