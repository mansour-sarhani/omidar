'use client';

import { useEffect, useState } from 'react';
import useContract from '@/hooks/useContract';
import useCommonHooks from '@/hooks/useCommonHooks';
import { dateFormatter } from '@/utils/dateFormatter';
import setStatusLabel from '@/utils/setStatusLabel';
import removeOfferFromContract from '@/functions/contract/removeOfferFromContract';
import getContractDataByType from '@/functions/contract/getContractDataByType';
import NoData from '@/components/common/NoData';
import OmProgress from '@/components/common/OmProgress';
import OmTableFooter from '@/components/common/OmTableFooter';
import DeleteModal from '@/components/modals/DeleteModal';
import AddOfferForm from '@/components/forms/AddOfferForm';
import UpdateOfferForm from '@/components/forms/UpdateOfferForm';
import ContractNavigation from '@/components/common/ContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import PanelModal from '@/components/modals/PanelModal';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ContractOffersPage({ contractNo }) {
    const [offers, setOffers] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { contract } = useContract(contractNo);

    const { dispatch, enqueueSnackbar, userData } = useCommonHooks();

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveoffer = (id) => {
        const data = {
            offerId: id,
            contractId: contract._id,
            userId: userData._id,
        };
        async function removeItem() {
            await removeOfferFromContract(dispatch, enqueueSnackbar, data);
            setDoReload(true);
        }
        removeItem();
    };

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'offers',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setOffers,
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
            <ContractNavigation contractNo={contractNo} />
            <div className="contract-page-content">
                <div className="contract-page-heading">
                    <Typography variant="h4">پیشنهادها و آفرها</Typography>
                    <PanelModal
                        buttonLabel="اضافه کردن آفر"
                        modalHeader="اضافه کردن آفر"
                        icon="add"
                    >
                        <AddOfferForm
                            setDoReload={setDoReload}
                            contractId={contract._id}
                            userId={userData._id}
                        />
                    </PanelModal>
                </div>

                {!offers ? (
                    <OmProgress />
                ) : offers && offers.length > 0 ? (
                    <div className="panel-inner-content">
                        <TableContainer component={Paper}>
                            <Table aria-label="offers table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell align="center">
                                            شناسه
                                        </TableCell>
                                        <TableCell align="center">
                                            عنوان
                                        </TableCell>
                                        <TableCell align="center">
                                            دانشگاه
                                        </TableCell>
                                        <TableCell align="center">
                                            شهریه
                                        </TableCell>
                                        <TableCell align="center">
                                            نظر متقاضی
                                        </TableCell>
                                        <TableCell align="center">
                                            آزمون ورودی
                                        </TableCell>
                                        <TableCell align="center">
                                            تاریخ آزمون ورودی
                                        </TableCell>
                                        <TableCell align="center">
                                            مصاحبه
                                        </TableCell>
                                        <TableCell align="center">
                                            تاریخ مصاحبه
                                        </TableCell>
                                        <TableCell align="center">
                                            آخرین مهلت ثبت نام
                                        </TableCell>
                                        <TableCell align="center">
                                            وضعیت
                                        </TableCell>
                                        <TableCell align="center">
                                            عملیات
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? offers.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : offers
                                    ).map((offer) => (
                                        <TableRow key={offer._id}>
                                            <TableCell align="center">
                                                {offer.Id}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.title}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.university}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.applicationFee}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.clientComment}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.test ? 'دارد' : 'ندارد'}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(offer.testDate)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {offer.interview
                                                    ? 'دارد'
                                                    : 'ندارد'}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(
                                                    offer.interviewDate
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {dateFormatter(offer.deadline)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {setStatusLabel(offer.status)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="om-table-actions">
                                                    <PanelModal
                                                        data={offer}
                                                        buttonLabel="به روزرسانی"
                                                        modalHeader="به روزرسانی آفر"
                                                        type="table"
                                                        icon="edit"
                                                        tooltipTitle="ویرایش"
                                                        variant="outlined"
                                                    >
                                                        <UpdateOfferForm
                                                            setDoReload={
                                                                setDoReload
                                                            }
                                                            contractId={
                                                                contract._id
                                                            }
                                                            userId={
                                                                userData._id
                                                            }
                                                        />
                                                    </PanelModal>
                                                    <DeleteModal
                                                        data={offer._id}
                                                        handleRemoveItem={
                                                            handleRemoveoffer
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
                                            <TableCell colSpan={12} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <OmTableFooter
                                    rows={offers}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    colSpan={12}
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
