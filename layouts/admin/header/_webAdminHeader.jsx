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
import getUserUnreadNotifications from '@/functions/user/getUserUnreadNotifications';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function WebAdminHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [doReload, setDoReload] = useState(true);
    const [total, setTotal] = useState(true);

    const { user, isDarkMode, toggleDarkMode, handleLogout, socket } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    useEffect(() => {
        if (doReload) {
            async function getUnreadNotifications() {
                await getUserUnreadNotifications(
                    dispatch,
                    enqueueSnackbar,
                    setNotifications,
                    setTotal
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
                        <li className="menu-item link-item">
                            <a href="https://omidarmigrate.com/">
                                وبسایت امیدار
                            </a>
                        </li>
                        <li className="menu-item link-item">
                            <a href="https://omidarmigrate.com/blog/">
                                مجله مهاجرت
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="header-logo">
                    <Link href={'/'}>
                        <Logo
                            color={isDarkMode ? 'white' : 'black'}
                            width={60}
                            height={60}
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

                        {/* <li
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
                        </li> */}
                    </ul>
                </div>
            </div>
        </header>
    );
}
