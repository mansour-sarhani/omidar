import Link from 'next/link';
import Logo from '@/components/common/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export default function WebFrontHeader(props) {
    const { isDarkMode, toggleDarkMode } = props;

    return (
        <header className="header front-header web-header">
            <div className="om-container">
                <div className="header-container">
                    <div className="header-menu front-menu">
                        <div className="header-logo">
                            <Link href={'/'}>
                                <Logo color={'white'} width={60} height={60} />
                            </Link>
                        </div>
                        <nav className="header-nav">
                            <ul>
                                <li className="menu-item link-item">
                                    <Link href="/">
                                        <HomeOutlinedIcon />
                                        صفحه اصلی
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
                    </div>

                    <div className="header-menu front-menu left-menu">
                        <nav className="header-nav">
                            <ul>
                                {/* <li
                                    className="menu-item button-item"
                                    style={{ marginLeft: 0 }}
                                >
                                    <Tooltip
                                        title={
                                            isDarkMode ? 'حالت روز' : 'حالت شب'
                                        }
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
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
