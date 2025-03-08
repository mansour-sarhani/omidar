import Link from 'next/link';
import Logo from '@/components/common/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import OmAvatar from '@/components/common/OmAvatar';
import { usePathname } from 'next/navigation';
import { getMenuItemClass } from '@/utils/getMenuItemClass';
import getClientUnreadNotifications from '@/functions/client/getClientUnreadNotifications';

export default function MobilePanelHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [doReload, setDoReload] = useState(true);
    const [total, setTotal] = useState(true);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const { client, isDarkMode, toggleDarkMode, handleLogout, socket } = props;

    const drawerWidth = 240;

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    useEffect(() => {
        if (doReload) {
            async function getUnreadNotifications() {
                await getClientUnreadNotifications(
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
            if (data.receiver.includes(client._id)) {
                setDoReload(true);
            }
        });
    }, [client, socket]);

    const path = usePathname();

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <header className="header admin-header mboile-header">
            <div className="om-container">
                <div className="header-container">
                    <AppBar component="div" className="mobile-header-appbar">
                        <Toolbar className="mobile-header-toolbar">
                            <div className="header-logo">
                                <Link href={'/'}>
                                    <Logo
                                        color={isDarkMode ? 'white' : 'black'}
                                        width={40}
                                        height={40}
                                    />
                                </Link>
                                <Typography
                                    variant="h1"
                                    className="mobile-header-logo-text"
                                >
                                    امیدار
                                </Typography>
                            </div>
                            <div className="mobile-header-util">
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
                                {/* <Tooltip
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
                                </Tooltip> */}

                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        container={container}
                        className="panel-filter-drawer"
                        anchor="right"
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                    >
                        <Box onClick={handleDrawerToggle}>
                            <nav className="mobile-header-nav">
                                <div className="panel-sidebar-container">
                                    <div className="panel-sidebar-top">
                                        <div className="panel-sidebar-avatar">
                                            <OmAvatar person={client} />
                                        </div>
                                        <div className="panel-sidebar-top-text">
                                            <Typography variant="h6">
                                                {client.firstName}{' '}
                                                {client.lastName}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="panel-sidebar-menu">
                                        <ul>
                                            <div className="panel-sidebar-separator">
                                                <Typography variant="h6">
                                                    پنل کاربری
                                                </Typography>
                                            </div>
                                            <li
                                                className={getMenuItemClass(
                                                    path,
                                                    '/panel/dashboard'
                                                )}
                                            >
                                                <Link href="/panel/dashboard">
                                                    پیشخوان
                                                </Link>
                                            </li>
                                            <li
                                                className={getMenuItemClass(
                                                    path,
                                                    '/panel/contract'
                                                )}
                                            >
                                                <Link href="/panel/contract">
                                                    قراردادها
                                                </Link>
                                            </li>
                                            <li
                                                className={getMenuItemClass(
                                                    path,
                                                    '/panel/profile'
                                                )}
                                            >
                                                <Link href="/panel/profile">
                                                    حساب کاربری
                                                </Link>
                                            </li>
                                            <li
                                                className={getMenuItemClass(
                                                    path,
                                                    '/panel/ticket'
                                                )}
                                            >
                                                <Link href="/panel/ticket">
                                                    تیکت های پشتیبانی
                                                </Link>
                                            </li>
                                            <li
                                                className={getMenuItemClass(
                                                    path,
                                                    '/panel/notification'
                                                )}
                                            >
                                                <Link href="/panel/notification">
                                                    اعلان ها
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
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
                                </ul>
                            </nav>
                        </Box>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
