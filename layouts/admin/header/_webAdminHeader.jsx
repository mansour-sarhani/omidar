import Link from 'next/link';
import useCommonHooks from '@/hooks/useCommonHooks';
import Logo from '@/components/common/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useEffect, useState } from 'react';
import getUserNotifications from '@/functions/user/getUserNotifications';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function WebAdminHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [doReload, setDoReload] = useState(true);

    const { user, isDarkMode, toggleDarkMode, handleLogout, socket } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function getUnreadNotifications() {
                await getUserNotifications(
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
            if (data.receiver.includes(user._id)) {
                setDoReload(true);
            }
        });
    }, [user, socket]);

    return (
        <header className="header panel-header web-header">
            <div className="header-container">
                <div className="header-menu panel-menu">
                    <ul>
                        <li className="menu-item link-item">
                            <Link href="/">
                                <HomeOutlinedIcon />
                                خانه
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
                                    href="/admin/notification"
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
