'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import adminGetAllCountries from '@/functions/admin/countries/adminGetAllCountries';
import deleteCountry from '@/functions/country/deleteCountry';
import NoData from '@/components/common/NoData';
import PanelModal from '@/components/modals/PanelModal';
import OmProgress from '@/components/common/OmProgress';
import DeleteModal from '@/components/modals/DeleteModal';
import AddCountryForm from '@/components/forms/AddCountryForm';
import UpdateCountryForm from '@/components/forms/UpdateCountryForm';
import OmTableFooter from '@/components/common/OmTableFooter';
import OmImage from '@/components/common/OmIamge';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CountryManagementPage() {
    const [countries, setCountries] = useState(null);
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

    const handleRemoveItem = async (countryId) => {
        await deleteCountry(dispatch, enqueueSnackbar, countryId);
        setDoReload(!doReload);
    };

    useEffect(() => {
        if (doReload) {
            async function fetchData() {
                await adminGetAllCountries(
                    dispatch,
                    enqueueSnackbar,
                    setCountries
                );
            }
            fetchData();
        }
        setDoReload(false);
    }, [dispatch, doReload, enqueueSnackbar]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدیریت کشورها</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید کشورهای حوزه کاری خود را اضافه
                        نمایید.
                    </Typography>
                </div>
                <PanelModal
                    buttonLabel="اضافه کردن کشور"
                    modalHeader="اضافه کردن کشور"
                    icon="add"
                >
                    <AddCountryForm setDoReload={setDoReload} />
                </PanelModal>
            </div>

            {!countries ? (
                <OmProgress />
            ) : countries && countries.length > 0 ? (
                <div className="panel-inner-content">
                    <TableContainer component={Paper}>
                        <Table aria-label="countries table">
                            <TableHead sx={{ backgroundColor: '#ccc' }}>
                                <TableRow>
                                    <TableCell align="center" width={70}>
                                        ردیف
                                    </TableCell>
                                    <TableCell align="center">پرچم</TableCell>
                                    <TableCell align="center">
                                        نام کشور
                                    </TableCell>
                                    <TableCell align="center">
                                        نام کشور به انگلیسی
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
                                    ? countries.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : countries
                                ).map((country, index) => (
                                    <TableRow key={country._id}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="panel-table-image-wrapper">
                                                <OmImage
                                                    name={country.flag}
                                                    variant="rounded"
                                                    width={50}
                                                    height={50}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            {country.nameFarsi}
                                        </TableCell>
                                        <TableCell align="center">
                                            {country.nameEnglish}
                                        </TableCell>
                                        <TableCell align="center">
                                            {setStatusLabel(country.status)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dateFormatter(country.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="om-table-actions">
                                                <PanelModal
                                                    data={country}
                                                    buttonLabel="ویرایش"
                                                    modalHeader="ویرایش کشور"
                                                    type="table"
                                                    icon="edit"
                                                    tooltipTitle="ویرایش کشور"
                                                    variant="outlined"
                                                >
                                                    <UpdateCountryForm
                                                        setDoReload={
                                                            setDoReload
                                                        }
                                                    />
                                                </PanelModal>
                                                <DeleteModal
                                                    data={country._id}
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
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <OmTableFooter
                                rows={countries}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                colSpan={6}
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
