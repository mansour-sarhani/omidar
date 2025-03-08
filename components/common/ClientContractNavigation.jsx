import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import ApprovalIcon from '@mui/icons-material/Approval';
import HailIcon from '@mui/icons-material/Hail';
import PaymentsIcon from '@mui/icons-material/Payments';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';

export default function ClientContractNavigation({ contractNo }) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const pathname = usePathname();

    const viewPort = useSelector((state) => state.settings.viewPort);

    useEffect(() => {
        switch (pathname) {
            case `/panel/contract/${contractNo}/overview`:
                setValue(0);
                break;
            case `/panel/contract/${contractNo}/documents`:
                setValue(1);
                break;
            case `/panel/contract/${contractNo}/offers`:
                setValue(2);
                break;
            case `/panel/contract/${contractNo}/visas`:
                setValue(3);
                break;
            case `/panel/contract/${contractNo}/pickups`:
                setValue(4);
                break;
            case `/panel/contract/${contractNo}/payments`:
                setValue(5);
                break;
            case `/panel/contract/${contractNo}/history`:
                setValue(6);
                break;
            default:
                setValue(0);
        }
    }, [pathname, contractNo]);

    if (viewPort === 'desktop') {
        return (
            <div className="contract-navigation">
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/overview`}
                    className={
                        pathname === `/panel/contract/${contractNo}/overview`
                            ? 'active'
                            : ''
                    }
                >
                    <InfoIcon />
                    اطلاعات قرارداد
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/documents`}
                    className={
                        pathname === `/panel/contract/${contractNo}/documents`
                            ? 'active'
                            : ''
                    }
                >
                    <FileCopyIcon />
                    مدارک و فایل ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/offers`}
                    className={
                        pathname === `/panel/contract/${contractNo}/offers`
                            ? 'active'
                            : ''
                    }
                >
                    <ArticleIcon />
                    پیشنهادها
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/visas`}
                    className={
                        pathname === `/panel/contract/${contractNo}/visas`
                            ? 'active'
                            : ''
                    }
                >
                    <ApprovalIcon />
                    ویزاها
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/pickups`}
                    className={
                        pathname === `/panel/contract/${contractNo}/pickups`
                            ? 'active'
                            : ''
                    }
                >
                    <HailIcon />
                    پیکاپ ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/payments`}
                    className={
                        pathname === `/panel/contract/${contractNo}/payments`
                            ? 'active'
                            : ''
                    }
                >
                    <PaymentsIcon />
                    پرداخت ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/panel/contract/${contractNo}/history`}
                    className={
                        pathname === `/panel/contract/${contractNo}/history`
                            ? 'active'
                            : ''
                    }
                >
                    <HistoryIcon />
                    تاریخچه
                </Button>
            </div>
        );
    } else {
        return (
            <div className="mobile-contract-navigation">
                <Box
                    sx={{
                        maxWidth: { xs: 320, sm: 480 },
                        bgcolor: 'background.paper',
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab
                            label="اطلاعات قرارداد"
                            href={`/panel/contract/${contractNo}/overview`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/overview`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="مدارک و فایل ها"
                            href={`/panel/contract/${contractNo}/documents`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/documents`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پیشنهادها"
                            href={`/panel/contract/${contractNo}/offers`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/offers`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="ویزاها"
                            href={`/panel/contract/${contractNo}/visas`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/visas`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پیکاپ ها"
                            href={`/panel/contract/${contractNo}/pickups`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/pickups`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پرداخت ها"
                            href={`/panel/contract/${contractNo}/payments`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/payments`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="تاریخچه"
                            href={`/panel/contract/${contractNo}/history`}
                            className={
                                pathname ===
                                `/panel/contract/${contractNo}/history`
                                    ? 'active'
                                    : ''
                            }
                        />
                    </Tabs>
                </Box>
            </div>
        );
    }
}
