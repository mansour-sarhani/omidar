'use client';

import { useEffect } from 'react';
import ClientLoginForm from '@/components/forms/ClientLoginForm';
import useCommonHooks from '@/hooks/useCommonHooks';

export default function ClientLoginPage() {
    const { searchParams, enqueueSnackbar, router } = useCommonHooks();

    const logout = searchParams.get('logout');

    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/client/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [enqueueSnackbar, logout, router, searchParams]);

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
