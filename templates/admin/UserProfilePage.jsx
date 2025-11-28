'use client';

import IsLoading from '@/components/common/IsLoading';
import OmAvatar from '@/components/common/OmAvatar';
import UserUpdateProfileForm from '@/components/forms/UserUpdateProfileForm';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import PanelModal from '@/components/modals/PanelModal';
import getCurrentUser from '@/functions/user/getCurrentUser';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import FA from '@/utils/localizationFa';
import setStatusLabel from '@/utils/setStatusLabel';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
    const [doReload, setDoReload] = useState(true);
    const [userData, setUserData] = useState(null);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await getCurrentUser(dispatch, enqueueSnackbar, setUserData);
                setDoReload(false);
            }
            fetchData();
        }
    }, [doReload, dispatch, enqueueSnackbar, setDoReload]);

    if (!userData) {
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
                        type="user"
                        data={userData}
                        mode="self"
                    />
                    <PanelModal
                        buttonLabel="ویرایش "
                        modalHeader="ویرایش حساب کاربری"
                        icon="edit"
                        data={userData}
                    >
                        <UserUpdateProfileForm setDoReload={setDoReload} />
                    </PanelModal>
                </div>
            </div>

            <div className="panel-inner-content">
                <div className="profile-wrapper">
                    <div className="profile-avatar">
                        <OmAvatar width={150} height={150} person={userData} />
                    </div>
                    <div className="profile-info">
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>نقش:</label>
                                <Typography variant="body1">
                                    {FA.role[userData.role]}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>وضعیت:</label>
                                {setStatusLabel(userData.status)}
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>کد ملی:</label>
                                <Typography variant="body1">
                                    {userData.nationalId}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>تاریخ عضویت:</label>
                                <Typography variant="body1">
                                    {dateFormatter(userData.createdAt)}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>نام:</label>
                                <Typography variant="body1">
                                    {userData.firstName}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>نام خانوادگی:</label>
                                <Typography variant="body1">
                                    {userData.lastName}
                                </Typography>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-item">
                                <label>شماره موبایل:</label>
                                <Typography variant="body1">
                                    {userData.mobile}
                                </Typography>
                            </div>
                            <div className="profile-item">
                                <label>ایمیل:</label>
                                <Typography variant="body1">
                                    {userData.email}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
