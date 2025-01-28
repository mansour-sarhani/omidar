'use client';

import { useEffect, useState } from 'react';
import useContract from '@/hooks/useContract';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import getContractDataByType from '@/functions/contract/getContractDataByType';
import NoData from '@/components/common/NoData';
import OmProgress from '@/components/common/OmProgress';
import OmTableFooter from '@/components/common/OmTableFooter';
import IsLoading from '@/components/common/IsLoading';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Download from '@mui/icons-material/Download';
import FA from '@/utils/localizationFa';
import ClientContractNavigation from '@/components/common/ClientContractNavigation';
import setStatusLabel from '@/utils/setStatusLabel';

export default function ClientContractPaymentsPage({ contractNo }) {
    const [payments, setPayments] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const { contract } = useContract(contractNo);

    const { dispatch, enqueueSnackbar, userData } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 20));
        setPage(0);
    };

    const handleDownload = (data) => {
        const fileUrl = `${data.path}${data.url}`;
        window.open(fileUrl, '_blank');
    };

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'payments',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setPayments,
                        data
                    );
                }
                fetchData();
                setDoReload(false);
            }
            setDoReload(false);
        }
    }, [contract, dispatch, doReload, enqueueSnackbar]);

    if (!contract) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="contract-page">
            <ClientContractNavigation contractNo={contractNo} />
            <div className="contract-page-content">
                <div className="contract-page-heading">
                    <Typography variant="h4">پرداخت ها</Typography>
                </div>

                {!payments ? (
                    <OmProgress />
                ) : payments && payments.length > 0 ? (
                    <div className="panel-inner-content">
                        <TableContainer component={Paper}>
                            <Table aria-label="payments table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell align="center">
                                            ردیف
                                        </TableCell>
                                        <TableCell align="center">
                                            عنوان
                                        </TableCell>
                                        <TableCell align="center">
                                            نوع پرداخت
                                        </TableCell>
                                        <TableCell align="center">
                                            مبلغ
                                        </TableCell>
                                        <TableCell align="center">
                                            واحد ارز
                                        </TableCell>
                                        <TableCell align="center">
                                            نحوه پرداخت
                                        </TableCell>
                                        <TableCell align="center">
                                            زمان پرداخت
                                        </TableCell>
                                        <TableCell align="center">
                                            وضعیت
                                        </TableCell>
                                        <TableCell align="center">
                                            سند پرداخت
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? payments.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : payments
                                    ).map((payment, index) => (
                                        <TableRow key={payment._id}>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                {payment.title}
                                            </TableCell>
                                            <TableCell align="center">
                                                {FA.paymentType[payment.type]}
                                            </TableCell>
                                            <TableCell align="center">
                                                {payment.paidAmount}
                                            </TableCell>
                                            <TableCell align="center">
                                                {FA.currency[payment.currency]}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    FA.paymentMethod[
                                                        payment.paymentMethod
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(
                                                    payment.dateOfPayment
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {setStatusLabel(payment.status)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {payment.receipt.url !== '' ? (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleDownload(
                                                                payment.receipt
                                                            )
                                                        }
                                                    >
                                                        <Download />
                                                        دانلود
                                                    </Button>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{ height: 53 * emptyRows }}
                                        >
                                            <TableCell colSpan={9} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <OmTableFooter
                                    rows={payments}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    colSpan={9}
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
        </div>
    );
}
