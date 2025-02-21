import ClientProfilePage from '@/templates/client/ClientProfilePage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | پروفایل کاربری',
};

export default function ClientProfile() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientProfilePage />
        </Suspense>
    );
}
