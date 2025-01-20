'use client';

import { useCallback, useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import userReadNotification from '@/functions/user/userReadNotification';
import getUserNotifications from '@/functions/user/getUserNotifications';
import NoData from '@/components/common/NoData';
import OmProgress from '@/components/common/OmProgress';
import NotificationItem from '@/components/common/NotificationItem';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import IsLoading from '@/components/common/IsLoading';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`notifications-tabpanel-${index}`}
            aria-labelledby={`notifications-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="notifications-wrapper">{children}</div>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `notifications-tab-${index}`,
        'aria-controls': `notifications-tabpanel-${index}`,
    };
}

export default function UserNotificationsPage() {
    const [notifications, setNotifications] = useState(null);
    const [type, setType] = useState('all');
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setNotifications(null);
        setPage(1);
        if (newValue === 1) {
            setType('unread');
        } else {
            setType('all');
        }
    };

    const markAsRead = (id) => {
        async function readNotifications() {
            await userReadNotification(dispatch, enqueueSnackbar, id);
            getNotifications();
        }
        readNotifications();
    };

    const getNotifications = useCallback(async () => {
        if (type === undefined) return;
        const data = {
            type,
            page,
            limit,
        };
        await getUserNotifications(
            dispatch,
            enqueueSnackbar,
            setNotifications,
            setTotal,
            data
        );
    }, [dispatch, enqueueSnackbar, limit, page, type]);

    const handlePaginationClick = (event, value) => {
        setNotifications(null);
        setPage(value);
    };

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    if (notifications === null) return <IsLoading isLoading={true} />;

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">اعلان ها</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید اعلان های ارسال شده برای شما را
                        مشاهده نمایید.
                    </Typography>
                </div>
            </div>

            <Tabs value={value} onChange={handleChange}>
                <Tab
                    icon={<NotificationsNoneIcon />}
                    iconPosition="start"
                    label="همه اعلان ها"
                    {...a11yProps(0)}
                />
                <Tab
                    icon={<NotificationsActiveIcon />}
                    iconPosition="start"
                    label="اعلان های خوانده نشده"
                    {...a11yProps(2)}
                />
            </Tabs>

            {!notifications ? (
                <OmProgress />
            ) : notifications && notifications.length > 0 ? (
                <div className="panel-inner-content">
                    <CustomTabPanel value={value} index={0}>
                        {notifications.map((item) => (
                            <NotificationItem
                                key={item._id}
                                item={item}
                                markAsRead={markAsRead}
                            />
                        ))}

                        <div className="pagination-container">
                            <Pagination
                                page={page}
                                count={Math.ceil(total / limit)}
                                onChange={handlePaginationClick}
                                showFirstButton
                                showLastButton
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        {notifications.map((item) => (
                            <NotificationItem
                                key={item._id}
                                item={item}
                                markAsRead={markAsRead}
                            />
                        ))}

                        <Pagination
                            page={page}
                            count={Math.ceil(total / limit)}
                            onChange={handlePaginationClick}
                            showFirstButton
                            showLastButton
                            color="primary"
                            shape="rounded"
                            size="large"
                        />
                    </CustomTabPanel>
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
}
