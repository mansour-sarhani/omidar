import Link from 'next/link';
import Logo from '@/components/common/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import getClientNotifications from '@/functions/client/getClientNotifications';

export default function WebPanelHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [doReload, setDoReload] = useState(true);

    const { client, isDarkMode, toggleDarkMode, handleLogout, socket } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function getUnreadNotifications() {
                await getClientNotifications(
                    dispatch,
                    enqueueSnackbar,
                    setNotifications,
                    'unread'
                );
                setDoReload(false);
            }
            getUnreadNotifications();
        }
    }, [dispatch, doReload, enqueueSnackbar, setDoReload]);

    useEffect(() => {
        socket.on('notification', (data) => {
            if (data.receiver.includes(client._id)) {
                setDoReload(true);
            }
        });
    }, [client, socket]);

    return (
        <header className="header panel-header">
            <div className="header-container">
                <div className="header-menu panel-menu">
                    <ul>
                        <li className="menu-item link-item">
                            <Link href="/">
                                <HomeOutlinedIcon />
                                صفحه اصلی
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="header-logo">
                    <Link href={'/'}>
                        <Logo
                            color={isDarkMode ? 'white' : 'black'}
                            width={243}
                            height={50}
                        />
                    </Link>
                </div>
                <div className="header-menu panel-menu left-menu">
                    <ul>
                        <li className="menu-item button-item">
                            <Button
                                variant="text"
                                color="error"
                                onClick={handleLogout}
                            >
                                <LogoutOutlinedIcon />
                                خروج
                            </Button>
                        </li>
                        <li className="menu-item link-item">
                            <Tooltip title="اعلان ها">
                                <Button
                                    variant="text"
                                    className="header-util-button"
                                    href="/panel/notification"
                                >
                                    <Badge
                                        badgeContent={notifications.length}
                                        color="error"
                                    >
                                        <NotificationsIcon color="action" />
                                    </Badge>
                                </Button>
                            </Tooltip>
                        </li>
                        <li
                            className="menu-item button-item"
                            style={{ marginLeft: 0 }}
                        >
                            <Tooltip
                                title={isDarkMode ? 'حالت روز' : 'حالت شب'}
                            >
                                <Button
                                    variant="text"
                                    onClick={toggleDarkMode}
                                    className="header-util-button"
                                >
                                    {isDarkMode ? (
                                        <LightModeOutlinedIcon />
                                    ) : (
                                        <DarkModeOutlinedIcon />
                                    )}
                                </Button>
                            </Tooltip>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
