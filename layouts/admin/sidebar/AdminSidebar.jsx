import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FA from '@/utils/localizationFa';
import { getMenuItemClass } from '@/utils/getMenuItemClass';
import Typography from '@mui/material/Typography';
import OmImage from '@/components/common/OmIamge';

export default function AdminSidebar({ user }) {
    const path = usePathname();

    return (
        <div className="panel-sidebar-container">
            <div className="panel-sidebar-top">
                <div className="panel-sidebar-avatar">
                    {user.avatar.url === '' ? (
                        <Image
                            src="/assets/images/misc/avatar.png"
                            alt="user-avatar"
                            width={50}
                            height={50}
                            style={{ borderRadius: '50%' }}
                        />
                    ) : (
                        <OmImage
                            name={user.avatar}
                            variant="circle"
                            width={50}
                            height={50}
                        />
                    )}
                </div>
                <div className="panel-sidebar-top-text">
                    <Typography variant="h6">
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="span">{FA.role[user.role]}</Typography>
                </div>
            </div>
            <div className="panel-sidebar-menu">
                <ul>
                    {user.role === 'admin' && (
                        <>
                            <div className="panel-sidebar-separator">
                                <Typography variant="h6">پنل مدیریت</Typography>
                            </div>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/admin/dashboard'
                                )}
                            >
                                <Link href="/admin/dashboard">پیشخوان</Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/admin/user'
                                )}
                            >
                                <Link href="/admin/user">مدیریت کارکنان</Link>
                            </li>
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
                                    '/admin/country'
                                )}
                            >
                                <Link href="/admin/country">مدیریت کشورها</Link>
                            </li>
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
                        </>
                    )}
                    {user.role === 'consultant' && (
                        <>
                            <div className="panel-sidebar-separator">
                                <Typography variant="h6">پنل مشاور</Typography>
                            </div>
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
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
