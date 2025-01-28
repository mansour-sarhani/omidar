import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractVisasPage = dynamic(
    () => import('@/templates/client/contract/ClientContractVisasPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | ویزاها',
};

export default function ClientContractOffers({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractVisasPage contractNo={params.contractNo} />
        </Suspense>
    );
}
