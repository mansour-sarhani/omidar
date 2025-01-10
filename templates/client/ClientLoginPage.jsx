'use client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import ClientLoginForm from '@/components/forms/ClientLoginForm';
import useCommonHooks from '@/hooks/useCommonHooks';
import IsLoading from '@/components/common/IsLoading';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

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
        <div className="inner-page auth-page client-auth">
            <div className="om-container">
                <div className="auth-box-wrapper">
                    <div className="auth-box-content">
                        <div className="auth-intro">
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                            >
                                گروه مهاجرتی امیدار
                            </Typography>
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                            >
                                ورود متقاضیان
                            </Typography>
                        </div>
                        <div className="auth-page-box">
                            <ClientLoginForm />
                        </div>
                    </div>
                    <div className="auth-box-image">
                        <Image
                            src={'/assets/images/website/login.svg'}
                            width={700}
                            height={700}
                            alt="login"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
