import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractPickupsPage = dynamic(
    () => import('@/templates/client/contract/ClientContractPickupsPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | پیکاپ ها',
};

export default function ContractPickups({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractPickupsPage contractNo={params.contractNo} />
        </Suspense>
    );
}
