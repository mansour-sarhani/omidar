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
import OmImage from '@/components/common/OmIamge';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { timeFormatter } from '@/utils/timeFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import Button from '@mui/material/Button';
import Download from '@mui/icons-material/Download';
import ClientContractNavigation from '@/components/common/ClientContractNavigation';
import clientRemoveTicketFile from '@/functions/client/clientRemoveTicketFile';
import UploadTicketModal from '@/components/modals/UploadTicketModal';
import { handleDownload } from '@/utils/createDownloadLink';

export default function ClientContractPickupsPage({ contractNo }) {
    const [pickups, setPickups] = useState(null);
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

    const handleRemoveFile = (id) => {
        async function removeVisa() {
            const data = {
                pickupId: id,
                contractId: contract._id,
            };
            await clientRemoveTicketFile(dispatch, enqueueSnackbar, data);
            setDoReload(true);
        }
        removeVisa();
    };

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'pickups',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setPickups,
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
                    <Typography variant="h4">پیکاپ ها</Typography>
                </div>

                {!pickups ? (
                    <OmProgress />
                ) : pickups && pickups.length > 0 ? (
                    <div className="panel-inner-content">
                        <TableContainer component={Paper}>
                            <Table aria-label="pickups table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell align="center">
                                            ردیف
                                        </TableCell>
                                        <TableCell align="center">
                                            کشور مقصد
                                        </TableCell>
                                        <TableCell align="center">
                                            شهر مقصد
                                        </TableCell>
                                        <TableCell align="center">
                                            تاریخ ورود به مقصد
                                        </TableCell>
                                        <TableCell align="center">
                                            زمان ورود به مقصد
                                        </TableCell>
                                        <TableCell align="center">
                                            شهر مبدا
                                        </TableCell>
                                        <TableCell align="center">
                                            تعداد مسافران
                                        </TableCell>
                                        <TableCell align="center">
                                            وضعیت
                                        </TableCell>
                                        <TableCell align="center">
                                            فایل بلیت
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? pickups.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : pickups
                                    ).map((pickup, index) => (
                                        <TableRow key={pickup._id}>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    <Chip
                                                        className="om-country-chip"
                                                        avatar={
                                                            <OmImage
                                                                name={
                                                                    pickup
                                                                        .country
                                                                        .flag
                                                                }
                                                                width={30}
                                                                height={30}
                                                                variant="rounded"
                                                            />
                                                        }
                                                        label={
                                                            pickup.country
                                                                .nameFarsi
                                                        }
                                                        color="primary"
                                                    />
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {pickup.pickupLocation}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(
                                                    pickup.dateOfArival
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {pickup.timeOfArival}
                                            </TableCell>
                                            <TableCell align="center">
                                                {pickup.originLocation}
                                            </TableCell>
                                            <TableCell align="center">
                                                {pickup.numberOfPassengers}
                                            </TableCell>
                                            <TableCell align="center">
                                                {setStatusLabel(pickup.status)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {pickup.ticket.url === '' ? (
                                                    <UploadTicketModal
                                                        data={pickup}
                                                        contractId={
                                                            contract._id
                                                        }
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    pickup.ticket
                                                                )
                                                            }
                                                        >
                                                            <Download />
                                                            دانلود
                                                        </Button>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleRemoveFile(
                                                                    pickup._id
                                                                )
                                                            }
                                                            color="error"
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </>
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
                                    rows={pickups}
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
