import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FA from '@/utils/localizationFa';
import { getMenuItemClass } from '@/utils/getMenuItemClass';
import OmImage from '@/components/common/OmIamge';
import Typography from '@mui/material/Typography';
import OmAvatar from '@/components/common/OmAvatar';

export default function AdminSidebar({ user }) {
    const path = usePathname();

    const isValid =
        user.role === 'admin' ||
        user.role === 'consultant' ||
        user.role === 'executive' ||
        user.role === 'chief_executive';

    return (
        <div className="panel-sidebar-container">
            <div className="panel-sidebar-top">
                <div className="panel-sidebar-avatar">
                    <OmAvatar person={user} />
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
                    {isValid && (
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
                            {user.role === 'admin' && (
                                <li
                                    className={getMenuItemClass(
                                        path,
                                        '/admin/user'
                                    )}
                                >
                                    <Link href="/admin/user">
                                        مدیریت افراد مجموعه
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
                                <Link href="/admin/visa">ویزاها</Link>
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
                                <Typography variant="h6">پنل کاربر</Typography>
                            </div>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/admin/profile'
                                )}
                            >
                                <Link href="/admin/profile">حساب کاربری</Link>
                            </li>

                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/admin/notification'
                                )}
                            >
                                <Link href="/admin/notification">اعلان ها</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
