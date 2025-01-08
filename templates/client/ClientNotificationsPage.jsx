'use client';

import { useCallback, useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import NoData from '@/components/common/NoData';
import OmProgress from '@/components/common/OmProgress';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import getClientNotifications from '@/functions/client/getClientNotifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { dateFormatter } from '@/utils/dateFormatter';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import clientReadNotification from '@/functions/client/clientReadNotification';
import { dateTimeFormatter } from '@/utils/dateTimeFormatter';

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

export default function ClientNotificationsPage() {
    const [notifications, setNotifications] = useState(null);
    const [type, setType] = useState('');
    const [value, setValue] = useState(0);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setNotifications(null);

        if (newValue === 1) {
            setType('read');
        } else if (newValue === 2) {
            setType('unread');
        } else {
            setType('');
        }
    };

    const markAsRead = (id) => {
        setNotifications(null);
        async function readNotifications() {
            await clientReadNotification(dispatch, enqueueSnackbar, id);
            getNotifications();
        }
        readNotifications();
    };

    const getNotifications = useCallback(async () => {
        await getClientNotifications(
            dispatch,
            enqueueSnackbar,
            setNotifications,
            type
        );
    }, [dispatch, enqueueSnackbar, type]);

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

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
                    icon={<NotificationsOffIcon />}
                    iconPosition="start"
                    label="اعلان های خوانده شده"
                    {...a11yProps(1)}
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
                            <div
                                key={item._id}
                                className={`notification-item ${
                                    item.isRead ? 'is-read' : 'is-unread'
                                }`}
                            >
                                <div className="notification-item-header">
                                    <Typography variant="h6">
                                        {item.subject}
                                    </Typography>

                                    {item.isRead ? (
                                        <Chip
                                            label="خوانده شده"
                                            color="success"
                                        />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={() => markAsRead(item._id)}
                                        >
                                            <DoneAllIcon />
                                            خواندم
                                        </Button>
                                    )}
                                </div>
                                <div className="notification-item-body">
                                    <Typography variant="body1">
                                        {item.body}
                                    </Typography>
                                    <Typography variant="body2">
                                        {dateTimeFormatter(item.createdAt)}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        {notifications.map((item) => (
                            <div
                                key={item._id}
                                className={`notification-item ${
                                    item.isRead ? 'is-read' : 'is-unread'
                                }`}
                            >
                                <div className="notification-item-header">
                                    <span>{dateFormatter(item.createdAt)}</span>
                                    {item.isRead ? (
                                        <Chip
                                            label="خوانده شده"
                                            color="success"
                                        />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={() => markAsRead(item._id)}
                                        >
                                            <DoneAllIcon />
                                            خواندم
                                        </Button>
                                    )}
                                </div>
                                <div className="notification-item-body">
                                    <Typography variant="h6">
                                        {item.subject}
                                    </Typography>
                                    <Typography variant="body1">
                                        {item.body}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        {notifications.map((item) => (
                            <div
                                key={item._id}
                                className={`notification-item ${
                                    item.isRead ? 'is-read' : 'is-unread'
                                }`}
                            >
                                <div className="notification-item-header">
                                    <span>{dateFormatter(item.createdAt)}</span>
                                    {item.isRead ? (
                                        <Chip
                                            label="خوانده شده"
                                            color="success"
                                        />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={() => markAsRead(item._id)}
                                        >
                                            <DoneAllIcon />
                                            خواندم
                                        </Button>
                                    )}
                                </div>
                                <div className="notification-item-body">
                                    <Typography variant="h6">
                                        {item.subject}
                                    </Typography>
                                    <Typography variant="body1">
                                        {item.body}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CustomTabPanel>
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
}
