'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import setStatusLabel from '@/utils/setStatusLabel';
import { dateFormatter } from '@/utils/dateFormatter';
import adminGetAllClients from '@/functions/admin/clients/adminGetAllClients';
import NoData from '@/components/common/NoData';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import OmTableFooter from '@/components/common/OmTableFooter';
import AddClientForm from '@/components/forms/AddClientForm';
import AdminUpdateClientForm from '@/components/forms/AdminUpdateClientForm';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterClientForm from '@/components/forms/FilterClientForm';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import OmAvatar from '@/components/common/OmAvatar';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function ClientManagementPage() {
    const [clients, setClients] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [open, setOpen] = useState(false);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 20));
        setPage(0);
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await adminGetAllClients(dispatch, enqueueSnackbar, setClients);
            }
            fetchData();
        }
        setDoReload(false);
    }, [dispatch, doReload, enqueueSnackbar]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدیریت متقاضیان</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید متقاضیان را مدیریت کنید و یا متقاضی
                        جدیدی اضافه نمایید.
                    </Typography>
                </div>
                <div className="panel-inner-header-btns">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={toggleDrawer(true)}
                    >
                        <FilterListIcon />
                        فیلترها
                    </Button>
                    <PanelModal
                        buttonLabel="اضافه کردن متقاضی"
                        modalHeader="اضافه کردن متقاضی"
                        icon="add"
                    >
                        <AddClientForm setDoReload={setDoReload} />
                    </PanelModal>
                </div>
            </div>

            <Drawer
                className="panel-filter-drawer"
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
            >
                <div className="panel-filter-container">
                    <div className="panel-filter-header">
                        <Typography variant="h6">فیلتر متقاضیان</Typography>
                        <IconButton onClick={toggleDrawer(false)}>
                            <HighlightOffIcon />
                        </IconButton>
                    </div>
                    <FilterClientForm
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        mobile={mobile}
                        setMobile={setMobile}
                        email={email}
                        setEmail={setEmail}
                        setClients={setClients}
                        setOpen={setOpen}
                    />
                </div>
            </Drawer>

            {!clients ? (
                <OmProgress />
            ) : clients && clients.length > 0 ? (
                <div className="panel-inner-content">
                    <TableContainer component={Paper}>
                        <Table aria-label="clients table">
                            <TableHead sx={{ backgroundColor: '#ccc' }}>
                                <TableRow>
                                    <TableCell align="center" width={70}>
                                        ردیف
                                    </TableCell>
                                    <TableCell align="right">
                                        نام و نام خانوادگی
                                    </TableCell>
                                    <TableCell align="center">
                                        شماره موبایل
                                    </TableCell>
                                    <TableCell align="center">ایمیل</TableCell>
                                    <TableCell align="center">وضعیت</TableCell>
                                    <TableCell align="center">
                                        زمان ایجاد
                                    </TableCell>
                                    <TableCell align="center">عملیات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? clients.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : clients
                                ).map((client, index) => (
                                    <TableRow key={client._id}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                }}
                                            >
                                                <div className="panel-table-image-wrapper">
                                                    <OmAvatar person={client} />
                                                </div>
                                                {client.firstName +
                                                    ' ' +
                                                    client.lastName}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {client.mobile}
                                        </TableCell>
                                        <TableCell align="center">
                                            {client.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {setStatusLabel(client.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dateFormatter(client.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="om-table-actions">
                                                <PanelModal
                                                    data={client}
                                                    buttonLabel="ویرایش"
                                                    modalHeader="ویرایش متقاضی"
                                                    type="table"
                                                    icon="edit"
                                                    tooltipTitle="ویرایش متقاضی"
                                                    variant="outlined"
                                                >
                                                    <AdminUpdateClientForm
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                    />
                                                </PanelModal>
                                                <ChangePasswordModal
                                                    type="client"
                                                    data={client}
                                                />
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
                                rows={clients}
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
