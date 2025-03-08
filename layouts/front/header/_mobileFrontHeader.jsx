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
import { useState } from 'react';

export default function MobileFrontHeader(props) {
    const { isDarkMode, toggleDarkMode } = props;

    const drawerWidth = 240;

    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <header className="header front-header mboile-header">
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
                            </nav>
                        </Box>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
