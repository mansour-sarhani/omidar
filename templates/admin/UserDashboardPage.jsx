'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

export default function UserDashboardPage() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const searchParams = useSearchParams();

    return <div className="panel-page dashboard-page">DASHBOARD</div>;
}
