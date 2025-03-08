'use client';

import IsLoading from '@/components/common/IsLoading';
import adminGetDashboardClients from '@/functions/admin/dashboard/adminGetDashboardClients';
import adminGetDashboardContracts from '@/functions/admin/dashboard/adminGetDashboardContracts';
import adminGetDashboardDocuments from '@/functions/admin/dashboard/adminGetDashboardDocuments';
import adminGetDashboardStats from '@/functions/admin/dashboard/adminGetDashboardStats';
import adminGetDashboardTickets from '@/functions/admin/dashboard/adminGetDashboardTickets';
import adminGetDashboardUsers from '@/functions/admin/dashboard/adminGetDashboardUsers';
import adminGetDashboardVisas from '@/functions/admin/dashboard/adminGetDashboardVisas';
import useCommonHooks from '@/hooks/useCommonHooks';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function UserDashboardPage() {
    const [users, setUsers] = useState(null);
    const [clients, setClients] = useState(null);
    const [contracts, setContracts] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [visas, setVisas] = useState(null);
    const [tickets, setTickets] = useState(null);

    const [stats, setStats] = useState(null);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        async function fetchData() {
            // await adminGetDashboardClients(
            //     dispatch,
            //     enqueueSnackbar,
            //     setClients
            // );
            // await adminGetDashboardUsers(dispatch, enqueueSnackbar, setUsers);
            // await adminGetDashboardContracts(
            //     dispatch,
            //     enqueueSnackbar,
            //     setContracts
            // );
            // await adminGetDashboardDocuments(
            //     dispatch,
            //     enqueueSnackbar,
            //     setDocuments
            // );
            // await adminGetDashboardVisas(dispatch, enqueueSnackbar, setVisas);
            // await adminGetDashboardTickets(
            //     dispatch,
            //     enqueueSnackbar,
            //     setTickets
            // );

            await adminGetDashboardStats(dispatch, enqueueSnackbar, setStats);
        }
        fetchData();
    }, [dispatch, enqueueSnackbar]);

    if (!stats) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">پیشخوان ادمین</Typography>
                </div>
            </div>
            <div className="panel-inner-content">
                <div className="panel-dashboard-wrapper">
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">متقاضیان</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/client"
                            >
                                مشاهده متقاضیان
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه متقاضیان
                                </Typography>
                                <Typography variant="h5">
                                    {stats.client.numberOfClients}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    متقاضیان فعال
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.client.activeClients}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    متقاضیان غیر فعال
                                </Typography>
                                <Typography variant="h5" color="error">
                                    {stats.client.inactiveClients}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    متقاضیان مسدود شده
                                </Typography>
                                <Typography variant="h5" color="#bbbbbb">
                                    {stats.client.bannedClients}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">کاربران</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/user"
                            >
                                مشاهده کاربران
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه کاربران
                                </Typography>
                                <Typography variant="h5">
                                    {stats.user.numberOfUsers}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    کاربران فعال
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.user.activeUsers}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    کاربران غیر فعال
                                </Typography>
                                <Typography variant="h5" color="error">
                                    {stats.user.inactiveUsers}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    کاربران مسدود شده
                                </Typography>
                                <Typography variant="h5" color="#bbbbbb">
                                    {stats.user.bannedUsers}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">قرادادها</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/contract"
                            >
                                مشاهده قرادادها
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه قرادادها
                                </Typography>
                                <Typography variant="h5">
                                    {stats.contract.numberOfContracts}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">فعال</Typography>
                                <Typography variant="h5" color="info">
                                    {stats.contract.activecontracts}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    در حال اجرا
                                </Typography>
                                <Typography variant="h5" color="warning">
                                    {stats.contract.processingContracts}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    انجام شده
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.contract.completedContracts}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    کنسل شده
                                </Typography>
                                <Typography variant="h5" color="#bbbbbb">
                                    {stats.contract.canceledContracts}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">مدارک</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/document"
                            >
                                مشاهده مدارک
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه مدارک
                                </Typography>
                                <Typography variant="h5">
                                    {stats.document.numberOfdocuments}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    تایید شده
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.document.approvedDocuments}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">رد شده</Typography>
                                <Typography variant="h5" color="error">
                                    {stats.document.rejectedDocuments}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    در انتظار متقاضی
                                </Typography>
                                <Typography variant="h5" color="warning">
                                    {stats.document.pendingDocuments}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    در حال بررسی
                                </Typography>
                                <Typography variant="h5" color="info">
                                    {stats.document.underReviewDocuments}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">ویزاها</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/visa"
                            >
                                مشاهده ویزاها
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه ویزاها
                                </Typography>
                                <Typography variant="h5">
                                    {stats.visa.numberOfvisas}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    تایید شده
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.visa.approvedVisas}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">رد شده</Typography>
                                <Typography variant="h5" color="error">
                                    {stats.visa.rejectedVisas}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    انتظار تایید
                                </Typography>
                                <Typography variant="h5" color="warning">
                                    {stats.visa.pendingVisas}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="panel-dashboard-box">
                        <div className="panel-dashboard-box-header">
                            <Typography variant="h6">تیکت ها</Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                href="/admin/ticket"
                            >
                                مشاهده تیکت ها
                            </Button>
                        </div>
                        <div className="panel-dashboard-box-stats">
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    همه تیکت ها
                                </Typography>
                                <Typography variant="h5">
                                    {stats.ticket.numberOftickets}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    در انتظار متقاضی
                                </Typography>
                                <Typography variant="h5" color="info">
                                    {stats.ticket.waitingOnClientTickets}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    در انتظار کارشناس
                                </Typography>
                                <Typography variant="h5" color="warning">
                                    {stats.ticket.waitingOnUserTickets}
                                </Typography>
                            </div>
                            <div className="panel-dashboard-box-item">
                                <Typography variant="body2">
                                    بسته شده
                                </Typography>
                                <Typography variant="h5" color="success">
                                    {stats.ticket.closedTickets}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
