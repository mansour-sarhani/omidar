import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import ApprovalIcon from '@mui/icons-material/Approval';
import PaymentsIcon from '@mui/icons-material/Payments';
import HistoryIcon from '@mui/icons-material/History';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HailIcon from '@mui/icons-material/Hail';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';

export default function ContractNavigation({ contractNo }) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const pathname = usePathname();

    const viewPort = useSelector((state) => state.settings.viewPort);

    useEffect(() => {
        switch (pathname) {
            case `/admin/contract/${contractNo}/overview`:
                setValue(0);
                break;
            case `/admin/contract/${contractNo}/users`:
                setValue(1);
                break;
            case `/admin/contract/${contractNo}/documents`:
                setValue(2);
                break;
            case `/admin/contract/${contractNo}/offers`:
                setValue(3);
                break;
            case `/admin/contract/${contractNo}/visas`:
                setValue(4);
                break;
            case `/admin/contract/${contractNo}/pickups`:
                setValue(5);
                break;
            case `/admin/contract/${contractNo}/payments`:
                setValue(6);
                break;
            case `/admin/contract/${contractNo}/history`:
                setValue(7);
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
                    href={`/admin/contract/${contractNo}/overview`}
                    className={
                        pathname === `/admin/contract/${contractNo}/overview`
                            ? 'active'
                            : ''
                    }
                >
                    <InfoIcon />
                    اطلاعات قرارداد
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/users`}
                    className={
                        pathname === `/admin/contract/${contractNo}/users`
                            ? 'active'
                            : ''
                    }
                >
                    <PeopleIcon />
                    کاربران
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/documents`}
                    className={
                        pathname === `/admin/contract/${contractNo}/documents`
                            ? 'active'
                            : ''
                    }
                >
                    <FileCopyIcon />
                    مدارک و فایل ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/offers`}
                    className={
                        pathname === `/admin/contract/${contractNo}/offers`
                            ? 'active'
                            : ''
                    }
                >
                    <ArticleIcon />
                    پیشنهادها
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/visas`}
                    className={
                        pathname === `/admin/contract/${contractNo}/visas`
                            ? 'active'
                            : ''
                    }
                >
                    <ApprovalIcon />
                    ویزاها
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/pickups`}
                    className={
                        pathname === `/admin/contract/${contractNo}/pickups`
                            ? 'active'
                            : ''
                    }
                >
                    <HailIcon />
                    پیکاپ ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/payments`}
                    className={
                        pathname === `/admin/contract/${contractNo}/payments`
                            ? 'active'
                            : ''
                    }
                >
                    <PaymentsIcon />
                    پرداخت ها
                </Button>
                <Button
                    variant="outlined"
                    href={`/admin/contract/${contractNo}/history`}
                    className={
                        pathname === `/admin/contract/${contractNo}/history`
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
                            href={`/admin/contract/${contractNo}/overview`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/overview`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="کاربران"
                            href={`/admin/contract/${contractNo}/users`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/users`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="مدارک و فایل ها"
                            href={`/admin/contract/${contractNo}/documents`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/documents`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پیشنهادها"
                            href={`/admin/contract/${contractNo}/offers`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/offers`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="ویزاها"
                            href={`/admin/contract/${contractNo}/visas`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/visas`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پیکاپ ها"
                            href={`/admin/contract/${contractNo}/pickups`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/pickups`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="پرداخت ها"
                            href={`/admin/contract/${contractNo}/payments`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/payments`
                                    ? 'active'
                                    : ''
                            }
                        />
                        <Tab
                            label="تاریخچه"
                            href={`/admin/contract/${contractNo}/history`}
                            className={
                                pathname ===
                                `/admin/contract/${contractNo}/history`
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
