import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContractHistoryPage = dynamic(
    () => import('@/templates/admin/contract/ContractHistoryPage'),
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
            <ContractHistoryPage contractNo={params.contractNo} />
        </Suspense>
    );
}
