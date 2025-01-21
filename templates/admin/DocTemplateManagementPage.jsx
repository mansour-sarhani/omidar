'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import deleteDocTemplate from '@/functions/document/deleteDocTemplate';
import adminGetAllDocTemplates from '@/functions/admin/templates/adminGetAllDocTemplates';
import NoData from '@/components/common/NoData';
import OmTableFooter from '@/components/common/OmTableFooter';
import AddDocTemplateForm from '@/components/forms/AddDocTemplateForm';
import UpdateDocTemplateForm from '@/components/forms/UpdateDocTemplateForm';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import DeleteModal from '@/components/modals/DeleteModal';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function DocTemplateManagementPage() {
    const [docTemplates, setDocTemplates] = useState(null);
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

    const handleRemoveItem = async (docTemplateId) => {
        await deleteDocTemplate(dispatch, enqueueSnackbar, docTemplateId);
        setDoReload(!doReload);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await adminGetAllDocTemplates(
                    dispatch,
                    enqueueSnackbar,
                    setDocTemplates
                );
                setDoReload(false);
            }
            fetchData();
        }
    }, [dispatch, doReload, enqueueSnackbar]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">نمونه قالب های فایل</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید نمونه قالب فایلهای چک لیست را اضافه
                        نمایید.
                    </Typography>
                </div>
                <PanelModal
                    buttonLabel="اضافه کردن نمونه قالب"
                    modalHeader="اضافه کردن نمونه قالب"
                    icon="add"
                >
                    <AddDocTemplateForm setDoReload={setDoReload} />
                </PanelModal>
            </div>

            {!docTemplates ? (
                <OmProgress />
            ) : docTemplates && docTemplates.length > 0 ? (
                <div className="panel-inner-content">
                    <TableContainer component={Paper}>
                        <Table aria-label="docTemplates table">
                            <TableHead sx={{ backgroundColor: '#ccc' }}>
                                <TableRow>
                                    <TableCell align="center" width={70}>
                                        ردیف
                                    </TableCell>
                                    <TableCell align="center">
                                        شماره رفرنس
                                    </TableCell>
                                    <TableCell align="center">
                                        نام قالب به فارسی
                                    </TableCell>
                                    <TableCell align="center">
                                        نام قالب به انگلیسی
                                    </TableCell>
                                    <TableCell align="center">
                                        نوع فایل
                                    </TableCell>
                                    <TableCell align="center">
                                        فرمت فایل
                                    </TableCell>
                                    <TableCell align="center">
                                        توضیحات
                                    </TableCell>
                                    <TableCell align="center">وضعیت</TableCell>
                                    <TableCell align="center">
                                        زمان ایجاد
                                    </TableCell>
                                    <TableCell align="center">عملیات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? docTemplates.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : docTemplates
                                ).map((docTemplate, index) => (
                                    <TableRow key={docTemplate._id}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.refNo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.nameFarsi}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.nameEnglish}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.type}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.format}
                                        </TableCell>
                                        <TableCell align="center">
                                            {docTemplate.description}
                                        </TableCell>
                                        <TableCell align="center">
                                            {setStatusLabel(docTemplate.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dateFormatter(
                                                docTemplate.createdAt
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="om-table-actions">
                                                <PanelModal
                                                    data={docTemplate}
                                                    buttonLabel="ویرایش"
                                                    modalHeader="ویرایش قالب"
                                                    type="table"
                                                    icon="edit"
                                                    tooltipTitle="ویرایش قالب"
                                                    variant="outlined"
                                                >
                                                    <UpdateDocTemplateForm
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                    />
                                                </PanelModal>
                                                <DeleteModal
                                                    data={docTemplate._id}
                                                    handleRemoveItem={
                                                        handleRemoveItem
                                                    }
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 53 * emptyRows }}
                                    >
                                        <TableCell colSpan={10} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <OmTableFooter
                                rows={docTemplates}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                colSpan={10}
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
