import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import ApprovalIcon from '@mui/icons-material/Approval';
import HailIcon from '@mui/icons-material/Hail';
import PaymentsIcon from '@mui/icons-material/Payments';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HistoryIcon from '@mui/icons-material/History';
import { usePathname } from 'next/navigation';

export default function ClientContractNavigation({ contractNo }) {
    const pathname = usePathname();

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
}
