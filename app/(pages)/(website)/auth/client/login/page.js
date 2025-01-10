import ClientLoginPage from '@/templates/client/ClientLoginPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | ورود متقاضیان به پرتال',
};

export default function ClientLogin() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientLoginPage />
        </Suspense>
    );
}
