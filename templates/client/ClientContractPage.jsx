'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { dateFormatter } from '@/utils/dateFormatter';
import NoData from '@/components/common/NoData';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import setStatusLabel from '@/utils/setStatusLabel';
import OmTableFooter from '@/components/common/OmTableFooter';
import getAllContracts from '@/functions/contract/getAllContracts';
import AddContractForm from '@/components/forms/AddContractForm';
import { Button } from '@mui/material';
import { Settings } from '@mui/icons-material';
import Link from 'next/link';

export default function ClientContractPage() {
    const [contracts, setContracts] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

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
                        در این قسمت میتوانید قراردادها را مدیریت نمایید.
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
                                    <TableCell align="center">شناسه</TableCell>
                                    <TableCell align="center">
                                        شماره قرارداد
                                    </TableCell>
                                    <TableCell align="center">متقاضی</TableCell>
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
                                ).map((contract) => (
                                    <TableRow key={contract._id}>
                                        <TableCell align="center">
                                            {contract.Id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.contractNo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.client.firstName}{' '}
                                            {contract.client.lastName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {contract.countries.map(
                                                (country) => country.nameFarsi
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
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        <Settings />
                                                        مدیریت قرارداد
                                                    </Button>
                                                </Link>
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
                                rows={contracts}
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
