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
import getUserUnreadNotifications from '@/functions/user/getUserUnreadNotifications';
import OmAvatar from '@/components/common/OmAvatar';
import FA from '@/utils/localizationFa';
import { usePathname } from 'next/navigation';
import { getMenuItemClass } from '@/utils/getMenuItemClass';

export default function MobileAdminHeader(props) {
    const [notifications, setNotifications] = useState([]);
    const [doReload, setDoReload] = useState(true);
    const [total, setTotal] = useState(true);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const { user, isDarkMode, toggleDarkMode, handleLogout, socket } = props;

    const drawerWidth = 240;

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

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

    const path = usePathname();

    const isValid =
        user.role === 'admin' ||
        user.role === 'consultant' ||
        user.role === 'executive' ||
        user.role === 'chief_executive';

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
                                            <OmAvatar person={user} />
                                        </div>
                                        <div className="panel-sidebar-top-text">
                                            <Typography variant="h6">
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Typography variant="span">
                                                {FA.role[user.role]}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="panel-sidebar-menu">
                                        <ul>
                                            {isValid && (
                                                <>
                                                    <div className="panel-sidebar-separator">
                                                        <Typography variant="h6">
                                                            پنل مدیریت
                                                        </Typography>
                                                    </div>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/dashboard'
                                                        )}
                                                    >
                                                        <Link href="/admin/dashboard">
                                                            پیشخوان
                                                        </Link>
                                                    </li>
                                                    {user.role === 'admin' && (
                                                        <li
                                                            className={getMenuItemClass(
                                                                path,
                                                                '/admin/user'
                                                            )}
                                                        >
                                                            <Link href="/admin/user">
                                                                مدیریت افراد
                                                                مجموعه
                                                            </Link>
                                                        </li>
                                                    )}
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/client'
                                                        )}
                                                    >
                                                        <Link href="/admin/client">
                                                            مدیریت متقاضیان
                                                        </Link>
                                                    </li>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/contract'
                                                        )}
                                                    >
                                                        <Link href="/admin/contract">
                                                            مدیریت قراردادها
                                                        </Link>
                                                    </li>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/document'
                                                        )}
                                                    >
                                                        <Link href="/admin/document">
                                                            مدارک و فایل ها
                                                        </Link>
                                                    </li>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/visa'
                                                        )}
                                                    >
                                                        <Link href="/admin/visa">
                                                            ویزاها
                                                        </Link>
                                                    </li>
                                                    {user.role === 'admin' && (
                                                        <li
                                                            className={getMenuItemClass(
                                                                path,
                                                                '/admin/country'
                                                            )}
                                                        >
                                                            <Link href="/admin/country">
                                                                مدیریت کشورها
                                                            </Link>
                                                        </li>
                                                    )}
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/document-template'
                                                        )}
                                                    >
                                                        <Link href="/admin/document-template">
                                                            نمونه قالب فایل ها
                                                        </Link>
                                                    </li>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/ticket'
                                                        )}
                                                    >
                                                        <Link href="/admin/ticket">
                                                            تیکت های پشتیبانی
                                                        </Link>
                                                    </li>
                                                    <div className="panel-sidebar-separator">
                                                        <Typography variant="h6">
                                                            پنل کاربر
                                                        </Typography>
                                                    </div>
                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/profile'
                                                        )}
                                                    >
                                                        <Link href="/admin/profile">
                                                            حساب کاربری
                                                        </Link>
                                                    </li>

                                                    <li
                                                        className={getMenuItemClass(
                                                            path,
                                                            '/admin/notification'
                                                        )}
                                                    >
                                                        <Link href="/admin/notification">
                                                            اعلان ها
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
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
