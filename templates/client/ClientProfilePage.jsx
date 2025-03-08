'use client';

import IsLoading from '@/components/common/IsLoading';
import OmAvatar from '@/components/common/OmAvatar';
import ClientUpdateProfileForm from '@/components/forms/ClientUpdateProfileForm';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import PanelModal from '@/components/modals/PanelModal';
import getCurrentClient from '@/functions/client/getCurrentClient';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

export default function ClientProfilePage() {
    const [doReload, setDoReload] = useState(true);
    const [clientData, setClientData] = useState(null);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await getCurrentClient(
                    dispatch,
                    enqueueSnackbar,
                    setClientData
                );
                setDoReload(false);
            }
            fetchData();
        }
    }, [doReload, dispatch, enqueueSnackbar, setDoReload]);

    if (!clientData) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">حساب کاربری</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید اطلاعات کاربری خود را مشاهده و
                        ویرایش کنید.
                    </Typography>
                </div>
                <div className="panel-inner-header-btns">
                    <ChangePasswordModal
                        type="client"
                        data={clientData}
                        mode="self"
                    />
                    <PanelModal
                        buttonLabel="ویرایش "
                        modalHeader="ویرایش حساب کاربری"
                        icon="edit"
                        data={clientData}
                    >
                        <ClientUpdateProfileForm setDoReload={setDoReload} />
                    </PanelModal>
                </div>
            </div>

            <div className="panel-inner-content">
                <div className="profile-wrapper">
                    <div className="profile-avatar">
                        <OmAvatar
                            width={150}
                            height={150}
                            person={clientData}
                        />
                    </div>
                    <div className="profile-info">
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>کد ملی:</label>
                                <Typography variant="body1">
                                    {clientData.nationalId}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>تاریخ عضویت:</label>
                                <Typography variant="body1">
                                    {dateFormatter(clientData.createdAt)}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>نام:</label>
                                <Typography variant="body1">
                                    {clientData.firstName}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>نام خانوادگی:</label>
                                <Typography variant="body1">
                                    {clientData.lastName}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>شماره موبایل:</label>
                                <Typography variant="body1">
                                    {clientData.mobile}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>ایمیل:</label>
                                <Typography variant="body1">
                                    {clientData.email}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>نام پدر:</label>
                                <Typography variant="body1">
                                    {clientData.fatherName}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>نام مادر:</label>
                                <Typography variant="body1">
                                    {clientData.motherName}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>جنسیت:</label>
                                <Typography variant="body1">
                                    {!clientData.gender
                                        ? ''
                                        : clientData.gender === 'male'
                                        ? 'آقا'
                                        : 'خانم'}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>تاریخ تولد:</label>
                                <Typography variant="body1">
                                    {dateFormatter(clientData.dateOfBirth)}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>آدرس:</label>
                                <Typography variant="body1">
                                    {clientData.address}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>کد پستی:</label>
                                <Typography variant="body1">
                                    {clientData.zipCode}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
