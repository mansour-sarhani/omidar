'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useCommonHooks from '@/hooks/useCommonHooks';
import useContract from '@/hooks/useContract';
import setStatusLabel from '@/utils/setStatusLabel';
import getContractDataByType from '@/functions/contract/getContractDataByType';
import DocumentCommentModal from '@/components/modals/DocumentCommentModal';
import ClientContractNavigation from '@/components/common/ClientContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import NoData from '@/components/common/NoData';
import OmProgress from '@/components/common/OmProgress';
import OmTableFooter from '@/components/common/OmTableFooter';
import UploadModal from '@/components/modals/UploadModal';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Download from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import clientRemoveFile from '@/functions/client/clientRemoveFile';
import { handleDownload } from '@/utils/createDownloadLink';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function ClientContractDocumentsPage({ contractNo }) {
    const [documents, setDocuments] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [description, setDescription] = useState('');

    const { contract } = useContract(contractNo);

    const { dispatch, enqueueSnackbar, clientData } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 20));
        setPage(0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRemoveFile = (id) => {
        async function deleteItem() {
            const data = {
                contractId: contract._id,
                documentId: id,
            };
            await clientRemoveFile(dispatch, enqueueSnackbar, data);
            setDoReload(true);
        }
        deleteItem();
    };

    const handlePopoverOpen = (event, desc) => {
        setAnchorEl(event.currentTarget);
        setDescription(desc);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setDescription('');
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'documents',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setDocuments,
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
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label="چک لیست  مدارک برای متقاضی" />
                    <Tab label="مدارک آپلود شده توسط کارشناس" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <div className="contract-page-heading">
                        <Typography variant="h4">چک لیست مدارک</Typography>
                    </div>
                    {!documents ? (
                        <OmProgress />
                    ) : documents && documents.length > 0 ? (
                        <div className="panel-inner-content">
                            <TableContainer component={Paper}>
                                <Table aria-label="documents table">
                                    <TableHead sx={{ backgroundColor: '#ccc' }}>
                                        <TableRow>
                                            <TableCell align="center">
                                                شماره فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                نام فایل به فارسی
                                            </TableCell>
                                            <TableCell align="center">
                                                نام فایل به انگلیسی
                                            </TableCell>
                                            <TableCell align="center">
                                                نوع فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                فرمت فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                نمونه فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                آپلود توسط متقاضی
                                            </TableCell>
                                            <TableCell align="center">
                                                وضعیت
                                            </TableCell>
                                            <TableCell align="center">
                                                پیام
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? documents.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage +
                                                      rowsPerPage
                                              )
                                            : documents
                                        )
                                            .filter((doc) => doc.isCheckList)
                                            .map((document) => (
                                                <TableRow key={document._id}>
                                                    <TableCell align="center">
                                                        {document.documentNo}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                                gap: '5px',
                                                            }}
                                                            onMouseEnter={(
                                                                event
                                                            ) =>
                                                                handlePopoverOpen(
                                                                    event,
                                                                    document.description
                                                                )
                                                            }
                                                            onMouseLeave={
                                                                handlePopoverClose
                                                            }
                                                        >
                                                            {document.nameFarsi}
                                                            <InfoIcon />
                                                        </Box>
                                                        <Popover
                                                            id="mouse-over-popover"
                                                            sx={{
                                                                pointerEvents:
                                                                    'none',
                                                            }}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            anchorOrigin={{
                                                                vertical:
                                                                    'bottom',
                                                                horizontal:
                                                                    'right',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal:
                                                                    'right',
                                                            }}
                                                            onClose={
                                                                handlePopoverClose
                                                            }
                                                            disableRestoreFocus
                                                        >
                                                            <Typography
                                                                sx={{ p: 1 }}
                                                                variant="body2"
                                                            >
                                                                {description}
                                                            </Typography>
                                                        </Popover>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.nameEnglish}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.type}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.format}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.sample.url !==
                                                        '' ? (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        document.sample
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
                                                        {document.file.url ===
                                                        '' ? (
                                                            <UploadModal
                                                                data={document}
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
                                                                            document.file
                                                                        )
                                                                    }
                                                                >
                                                                    <Download />
                                                                    دانلود
                                                                </Button>
                                                                {document.status !==
                                                                    'approved' && (
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleRemoveFile(
                                                                                document._id
                                                                            )
                                                                        }
                                                                        color="error"
                                                                    >
                                                                        <DeleteForeverIcon />
                                                                    </IconButton>
                                                                )}
                                                            </>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {setStatusLabel(
                                                            document.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <DocumentCommentModal
                                                            document={document}
                                                            type="view"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={9} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <OmTableFooter
                                        rows={documents}
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
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <div className="contract-page-heading">
                        <Typography variant="h4">مدارک تکمیلی</Typography>
                    </div>
                    {!documents ? (
                        <OmProgress />
                    ) : documents && documents.length > 0 ? (
                        <div className="panel-inner-content">
                            <TableContainer component={Paper}>
                                <Table aria-label="documents table">
                                    <TableHead sx={{ backgroundColor: '#ccc' }}>
                                        <TableRow>
                                            <TableCell align="center">
                                                شماره فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                نام فایل به فارسی
                                            </TableCell>
                                            <TableCell align="center">
                                                نام فایل به انگلیسی
                                            </TableCell>
                                            <TableCell align="center">
                                                نوع فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                فرمت فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                فایل
                                            </TableCell>
                                            <TableCell align="center">
                                                وضعیت
                                            </TableCell>
                                            <TableCell align="center">
                                                پیام
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? documents.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage +
                                                      rowsPerPage
                                              )
                                            : documents
                                        )
                                            .filter((doc) => !doc.isCheckList)
                                            .map((document) => (
                                                <TableRow key={document._id}>
                                                    <TableCell align="center">
                                                        {document.documentNo}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                                gap: '5px',
                                                            }}
                                                            onMouseEnter={(
                                                                event
                                                            ) =>
                                                                handlePopoverOpen(
                                                                    event,
                                                                    document.description
                                                                )
                                                            }
                                                            onMouseLeave={
                                                                handlePopoverClose
                                                            }
                                                        >
                                                            {document.nameFarsi}
                                                            <InfoIcon />
                                                        </Box>
                                                        <Popover
                                                            id="mouse-over-popover"
                                                            sx={{
                                                                pointerEvents:
                                                                    'none',
                                                            }}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            anchorOrigin={{
                                                                vertical:
                                                                    'bottom',
                                                                horizontal:
                                                                    'right',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal:
                                                                    'right',
                                                            }}
                                                            onClose={
                                                                handlePopoverClose
                                                            }
                                                            disableRestoreFocus
                                                        >
                                                            <Typography
                                                                sx={{ p: 1 }}
                                                                variant="body2"
                                                            >
                                                                {description}
                                                            </Typography>
                                                        </Popover>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.nameEnglish}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.type}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.format}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {document.file.url !==
                                                        '' ? (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        document.file
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
                                                        {setStatusLabel(
                                                            document.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <DocumentCommentModal
                                                            document={document}
                                                            type="view"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={9} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <OmTableFooter
                                        rows={documents}
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
                </TabPanel>
            </div>
        </div>
    );
}
