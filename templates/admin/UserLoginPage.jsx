'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import UserLoginForm from '@/components/forms/UserLoginForm';
import { jwtDecode } from 'jwt-decode';
import IsLoading from '@/components/common/IsLoading';
import { Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

export default function UserLoginPage() {
    const [token, setToken] = useState(null);
    const { enqueueSnackbar, router } = useCommonHooks();

    const searchParams = useSearchParams();

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

            if (decoded.exp * 1000 < Date.now()) {
                Cookies.remove('om_token');
                router.replace('/auth/admin/login');
            }

            if (decoded.type === 'user') {
                router.replace('/admin/dashboard');
            }
        }
    }, [currentToken, router, token]);

    if (token === null) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="inner-page auth-page admin-auth">
            <div className="full-bg-container">
                <div className="auth-box-wrapper">
                    <div className="auth-intro">
                        <Typography variant="h1" component="h1" gutterBottom>
                            گروه مهاجرتی امیدار
                        </Typography>
                        <Typography variant="h4" component="h4" gutterBottom>
                            ورود اعضا
                        </Typography>
                    </div>
                    <div className="auth-page-box">
                        <UserLoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
