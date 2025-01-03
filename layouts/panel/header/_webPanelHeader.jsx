import Link from 'next/link';
import Logo from '@/components/common/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export default function WebPanelHeader(props) {
    const { client, isDarkMode, toggleDarkMode, handleLogout } = props;

    return (
        <header className="header panel-header">
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
                            <Link href="/panel/profile">
                                <DashboardCustomizeOutlinedIcon />
                                پنل کاربری
                            </Link>
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
