'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import FA from '@/utils/localizationFa';
import setStatusLabel from '@/utils/setStatusLabel';
import adminGetAllUsers from '@/functions/admin/users/adminGetAllUsers';
import NoData from '@/components/common/NoData';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import OmTableFooter from '@/components/common/OmTableFooter';
import AdminUpdateUserForm from '@/components/forms/AdminUpdateUserForm';
import AddUserForm from '@/components/forms/AddUserForm';
import OmAvatar from '@/components/common/OmAvatar';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UserManagementPage() {
    const [users, setUsers] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await adminGetAllUsers(dispatch, enqueueSnackbar, setUsers);
            }
            fetchData();
        }
        setDoReload(false);
    }, [dispatch, doReload, enqueueSnackbar]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدیریت کارکنان</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید افراد مجموعه را مدیریت نمایید.
                    </Typography>
                </div>
                <PanelModal
                    buttonLabel="اضافه کردن کاربر"
                    modalHeader="اضافه کردن کاربر"
                    icon="add"
                >
                    <AddUserForm setDoReload={setDoReload} />
                </PanelModal>
            </div>

            {!users ? (
                <OmProgress />
            ) : users && users.length > 0 ? (
                <div className="panel-inner-content">
                    <TableContainer component={Paper}>
                        <Table aria-label="users table">
                            <TableHead sx={{ backgroundColor: '#ccc' }}>
                                <TableRow>
                                    <TableCell align="center">شناسه</TableCell>
                                    <TableCell align="center">تصویر</TableCell>
                                    <TableCell align="center">
                                        نام و نام خانوادگی
                                    </TableCell>
                                    <TableCell align="center">نقش</TableCell>
                                    <TableCell align="center">وضعیت</TableCell>
                                    <TableCell align="center">
                                        زمان ایجاد
                                    </TableCell>
                                    <TableCell align="center">عملیات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? users.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : users
                                ).map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell align="center">
                                            {user.Id}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="panel-table-image-wrapper">
                                                <OmAvatar person={user} />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            {user.firstName +
                                                ' ' +
                                                user.lastName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {FA.role[user.role]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {setStatusLabel(user.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dateFormatter(user.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="om-table-actions">
                                                <PanelModal
                                                    data={user}
                                                    buttonLabel="ویرایش"
                                                    modalHeader="ویرایش کاربر"
                                                    type="table"
                                                    icon="edit"
                                                    tooltipTitle="ویرایش کاربر"
                                                    variant="outlined"
                                                >
                                                    <AdminUpdateUserForm
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                    />
                                                </PanelModal>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <OmTableFooter
                                rows={users}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                colSpan={7}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={
                                    handleChangeRowsPerPage
                                }
                            />
                        </Table>
                    </TableContainer>
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
}
