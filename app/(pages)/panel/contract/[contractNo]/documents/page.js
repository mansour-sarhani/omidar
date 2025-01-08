import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ClientContractDocumentsPage = dynamic(
    () => import('@/templates/client/contract/ClientContractDocumentsPage'),
    {
        ssr: false,
    }
);

export const metadata = {
    title: 'امیدار | مدارک و فایلهای قرارداد',
};

export default function ClientContractDocuments({ params }) {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientContractDocumentsPage contractNo={params.contractNo} />
        </Suspense>
    );
}
