import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import ApprovalIcon from '@mui/icons-material/Approval';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentsIcon from '@mui/icons-material/Payments';
import HistoryIcon from '@mui/icons-material/History';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { usePathname } from 'next/navigation';

export default function ContractNavigation({ contractNo }) {
    const pathname = usePathname();

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
                <BusinessCenterIcon />
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
}
