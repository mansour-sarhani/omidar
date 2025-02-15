'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import useCommonHooks from '@/hooks/useCommonHooks';
import getAllContracts from '@/functions/contract/getAllContracts';
import OmTableFooter from '@/components/common/OmTableFooter';
import AddContractForm from '@/components/forms/AddContractForm';
import NoData from '@/components/common/NoData';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import UpdateContractForm from '@/components/forms/UpdateContractForm';
import OmAvatar from '@/components/common/OmAvatar';
import OmImage from '@/components/common/OmIamge';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Settings from '@mui/icons-material/Settings';

export default function ContractManagementPage() {
    const [contracts, setContracts] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 20));
        setPage(0);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await getAllContracts(dispatch, enqueueSnackbar, setContracts);
            }
            fetchData();
        }
        setDoReload(false);
    }, [dispatch, doReload, enqueueSnackbar]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدیریت قراردادها</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید قراردادها را مدیریت کنید و یا
                        قرارداد جدید ایجاد نمایید.
                    </Typography>
                </div>
                <PanelModal
                    buttonLabel="اضافه کردن قرارداد"
                    modalHeader="اضافه کردن قرارداد"
                    icon="add"
                >
                    <AddContractForm setDoReload={setDoReload} />
                </PanelModal>
            </div>

            {!contracts ? (
                <OmProgress />
            ) : contracts && contracts.length > 0 ? (
                <div className="panel-inner-content">
                    <TableContainer component={Paper}>
                        <Table aria-label="contracts table">
                            <TableHead sx={{ backgroundColor: '#ccc' }}>
                                <TableRow>
                                    <TableCell align="center" width={70}>
                                        ردیف
                                    </TableCell>
                                    <TableCell align="center">
                                        شماره قرارداد
                                    </TableCell>
                                    <TableCell align="center">متقاضی</TableCell>
                                    <TableCell align="center">
                                        کارشناسان
                                    </TableCell>
                                    <TableCell align="center">کشور</TableCell>
                                    <TableCell align="center">وضعیت</TableCell>
                                    <TableCell align="center">
                                        زمان ایجاد
                                    </TableCell>
                                    <TableCell align="center">عملیات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? contracts.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : contracts
                                ).map((contract, index) => (
                                    <TableRow key={contract._id}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.contractNo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.client.firstName}{' '}
                                            {contract.client.lastName}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="table-avatar-chips">
                                                {contract.users.map((user) => (
                                                    <Chip
                                                        key={user._id}
                                                        className="om-avatar-chip"
                                                        avatar={
                                                            <OmAvatar
                                                                person={user}
                                                                width={30}
                                                                height={30}
                                                            />
                                                        }
                                                        label={
                                                            user.firstName +
                                                            ' ' +
                                                            user.lastName
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.countries.map(
                                                (country) => (
                                                    <Chip
                                                        key={country._id}
                                                        className="om-country-chip"
                                                        avatar={
                                                            <OmImage
                                                                name={
                                                                    country.flag
                                                                }
                                                                width={30}
                                                                height={30}
                                                                variant="rounded"
                                                            />
                                                        }
                                                        label={
                                                            country.nameFarsi
                                                        }
                                                        color="primary"
                                                    />
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {setStatusLabel(contract.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dateFormatter(contract.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="om-table-actions">
                                                <Link
                                                    href={`/admin/contract/${contract.contractNo}/overview`}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <Settings />
                                                        مدیریت قرارداد
                                                    </Button>
                                                </Link>

                                                <PanelModal
                                                    data={contract}
                                                    buttonLabel="ویرایش اطلاعات اولیه"
                                                    modalHeader="ویرایش اطلاعات اولیه"
                                                    type="table"
                                                    icon="edit"
                                                    tooltipTitle="ویرایش اطلاعات اولیه"
                                                    variant="outlined"
                                                >
                                                    <UpdateContractForm
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
                                        <TableCell colSpan={8} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <OmTableFooter
                                rows={contracts}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                colSpan={8}
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
