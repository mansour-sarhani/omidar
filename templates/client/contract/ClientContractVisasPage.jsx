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
import clientRemoveVisaFile from '@/functions/client/clientRemoveVisaFile';
import UploadModal from '@/components/modals/UploadModal';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UploadVisaModal from '@/components/modals/UploadVisaModal';

export default function ClientContractVisasPage({ contractNo }) {
    const [visas, setVisas] = useState(null);
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

    const handleRemoveFile = (id, type) => {
        async function removeVisa() {
            const data = {
                visaId: id,
                type,
                contractId: contract._id,
            };
            await clientRemoveVisaFile(dispatch, enqueueSnackbar, data);
            setDoReload(true);
        }
        removeVisa();
    };

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'visas',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setVisas,
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
                    <Typography variant="h4">ویزاها</Typography>
                </div>

                {!visas ? (
                    <OmProgress />
                ) : visas && visas.length > 0 ? (
                    <div className="panel-inner-content">
                        <TableContainer component={Paper}>
                            <Table aria-label="visas table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell align="center">
                                            ردیف
                                        </TableCell>
                                        <TableCell align="center">
                                            نوع ویزا
                                        </TableCell>
                                        <TableCell align="center">
                                            تاریخ صدور ویزا
                                        </TableCell>
                                        <TableCell align="center">
                                            تاریخ اتمام ویزا
                                        </TableCell>
                                        <TableCell align="center">
                                            نوع دعوتنامه
                                        </TableCell>
                                        <TableCell align="center">
                                            دعوتنامه توسط کارشناس
                                        </TableCell>
                                        <TableCell align="center">
                                            ویزا توسط کارشناس
                                        </TableCell>
                                        <TableCell align="center">
                                            دعوتنامه توسط متقاضی
                                        </TableCell>
                                        <TableCell align="center">
                                            ویزا توسط متقاضی
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? visas.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : visas
                                    ).map((visa, index) => (
                                        <TableRow key={visa._id}>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                {FA.visaType[visa.visaType]}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(visa.issueDate)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(visa.expiryDate)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    FA.invLetterType[
                                                        visa.invLetterType
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {visa.userInvLetterFile.url !==
                                                '' ? (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleDownload(
                                                                visa.userInvLetterFile
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
                                            <TableCell align="center">
                                                {visa.userVisaFile.url !==
                                                '' ? (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() =>
                                                            handleDownload(
                                                                visa.userVisaFile
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
                                            <TableCell align="center">
                                                {visa.clientInvLetterFile
                                                    .url === '' ? (
                                                    <UploadVisaModal
                                                        data={visa}
                                                        contractId={
                                                            contract._id
                                                        }
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                        type="invLetter"
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    visa.clientInvLetterFile
                                                                )
                                                            }
                                                        >
                                                            <Download />
                                                            دانلود
                                                        </Button>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleRemoveFile(
                                                                    visa._id,
                                                                    'invLetter'
                                                                )
                                                            }
                                                            color="error"
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {visa.clientVisaFile.url ===
                                                '' ? (
                                                    <UploadVisaModal
                                                        data={visa}
                                                        contractId={
                                                            contract._id
                                                        }
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                        type="visa"
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    visa.clientVisaFile
                                                                )
                                                            }
                                                        >
                                                            <Download />
                                                            دانلود
                                                        </Button>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleRemoveFile(
                                                                    visa._id,
                                                                    'visa'
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
                                    rows={visas}
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
