import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getMenuItemClass } from '@/utils/getMenuItemClass';
import OmAvatar from '@/components/common/OmAvatar';
import Typography from '@mui/material/Typography';

export default function PanelSidebar({ client }) {
    const path = usePathname();

    return (
        <div className="panel-sidebar-container">
            <div className="panel-sidebar-top">
                <div className="panel-sidebar-avatar">
                    <OmAvatar person={client} />
                </div>
                <div className="panel-sidebar-top-text">
                    <Typography variant="h6">
                        {client.firstName} {client.lastName}
                    </Typography>
                </div>
            </div>
            <div className="panel-sidebar-menu">
                <ul>
                    <div className="panel-sidebar-separator">
                        <Typography variant="h6">پنل کاربری</Typography>
                    </div>
                    <li className={getMenuItemClass(path, '/panel/dashboard')}>
                        <Link href="/panel/dashboard">پیشخوان</Link>
                    </li>
                    <li className={getMenuItemClass(path, '/panel/contract')}>
                        <Link href="/panel/contract">قراردادها</Link>
                    </li>
                    <li
                        className={getMenuItemClass(
                            path,
                            '/panel/notification'
                        )}
                    >
                        <Link href="/panel/notification">پیام ها</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
