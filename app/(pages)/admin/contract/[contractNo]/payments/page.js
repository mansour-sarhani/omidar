import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContractPaymentsPage = dynamic(
    () => import('@/templates/admin/contract/ContractPaymentsPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | پرداخت ها',
};

export default function ContractPickups({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ContractPaymentsPage contractNo={params.contractNo} />
        </Suspense>
    );
}
