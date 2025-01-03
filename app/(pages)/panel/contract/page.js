import ClientContractPage from '@/templates/client/ClientContractPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'امیدار | مدیریت قراردادها',
};

export default function ClientContractManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractPage />
        </Suspense>
    );
}
