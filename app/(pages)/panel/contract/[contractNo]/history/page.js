import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractHistoryPage = dynamic(
    () => import('@/templates/client/contract/ClientContractHistoryPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | تاریخچه قرارداد',
};

export default function ContractHistory({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractHistoryPage contractNo={params.contractNo} />
        </Suspense>
    );
}
