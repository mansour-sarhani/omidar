'use client';

import ContractNavigation from '@/components/common/ContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import AddUserToContractForm from '@/components/forms/AddUserToContractForm';
import PanelModal from '@/components/modals/PanelModal';
import useContract from '@/hooks/useContract';
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import NoData from '@/components/common/NoData';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OmProgress from '@/components/common/OmProgress';
import FA from '@/utils/localizationFa';
import OmTableFooter from '@/components/common/OmTableFooter';
import OmImage from '@/components/common/OmIamge';
import { Box } from '@mui/system';
import removeUserFromContract from '@/functions/contract/removeUserFromContract';
import DeleteModal from '@/components/modals/DeleteModal';
import getContractDataByType from '@/functions/contract/getContractDataByType';

export default function ContractUsersPage({ contractNo }) {
    const [users, setUsers] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { contract } = useContract(contractNo);
    const updater = useSelector((state) => state.user.data);

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

    const handleRemoveUser = (userId) => {
        const data = {
            contractId: contract._id,
            userId: userId,
            performedBy: updater._id,
        };
        async function removeUser() {
            await removeUserFromContract(dispatch, enqueueSnackbar, data);
            setDoReload(true);
        }
        removeUser();
    };

    useEffect(() => {
        if (contract) {
            if (doReload) {
                async function fetchData() {
                    const data = {
                        type: 'users',
                        contractId: contract._id,
                    };
                    await getContractDataByType(
                        dispatch,
                        enqueueSnackbar,
                        setUsers,
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
                    <Typography variant="h4">کاربران</Typography>
                    <PanelModal
                        buttonLabel="اضافه کردن کاربر"
                        modalHeader="اضافه کردن کاربر"
                        icon="add"
                    >
                        <AddUserToContractForm
                            setDoReload={setDoReload}
                            contractId={contract._id}
                        />
                    </PanelModal>
                </div>

                {!users ? (
                    <OmProgress />
                ) : users && users.length > 0 ? (
                    <div className="panel-inner-content">
                        <TableContainer component={Paper}>
                            <Table aria-label="users table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell align="center">
                                            شناسه
                                        </TableCell>
                                        <TableCell align="center">
                                            تصویر
                                        </TableCell>
                                        <TableCell align="center">
                                            نام و نام خانوادگی
                                        </TableCell>
                                        <TableCell align="center">
                                            نقش
                                        </TableCell>
                                        <TableCell align="center">
                                            عملیات
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? users.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : users
                                    ).map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell align="center">
                                                {user.Id}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <OmImage
                                                        name={user.avatar}
                                                        variant="circle"
                                                        width={50}
                                                        height={50}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                {user.firstName +
                                                    ' ' +
                                                    user.lastName}
                                            </TableCell>
                                            <TableCell align="center">
                                                {FA.role[user.role]}
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="om-table-actions">
                                                    <DeleteModal
                                                        data={user._id}
                                                        handleRemoveItem={
                                                            handleRemoveUser
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
                                            <TableCell colSpan={5} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <OmTableFooter
                                    rows={users}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    colSpan={5}
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
