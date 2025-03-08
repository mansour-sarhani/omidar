'use client';

import IsLoading from '@/components/common/IsLoading';
import useCommonHooks from '@/hooks/useCommonHooks';
import React, { useCallback, useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OmProgress from '@/components/common/OmProgress';
import ChatIcon from '@mui/icons-material/Chat';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NoData from '@/components/common/NoData';
import adminGetAllVisas from '@/functions/admin/visa/adminGetAllVisas';
import VisaRow from '@/components/common/VisaRow';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`visas-tabpanel-${index}`}
            aria-labelledby={`visas-tab-${index}`}
            {...other}
        >
            {value === index && <div className="visas-wrapper">{children}</div>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `visas-tab-${index}`,
        'aria-controls': `visas-tabpanel-${index}`,
    };
}

export default function VisaManagementPage() {
    const [visas, setVisas] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [status, setStatus] = useState('all');
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setVisas(null);
        setPage(1);
        if (newValue === 1) {
            setStatus('approved');
        } else if (newValue === 2) {
            setStatus('rejected');
        } else if (newValue === 3) {
            setStatus('pending');
        } else {
            setStatus('all');
        }
    };

    const getVisas = useCallback(async () => {
        if (status === undefined) return;
        const data = {
            status,
            page,
            limit,
        };
        await adminGetAllVisas(
            dispatch,
            enqueueSnackbar,
            setVisas,
            setTotal,
            data
        );
    }, [dispatch, enqueueSnackbar, limit, page, status]);

    const handlePaginationClick = (event, value) => {
        setVisas(null);
        setPage(value);
    };

    useEffect(() => {
        getVisas();
    }, [getVisas]);

    if (visas === null) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">ویزا ها</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید ویزاهای متقاضیان را مشاهده نمایید.
                    </Typography>
                </div>
            </div>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
            >
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="همه ویزا ها"
                    {...a11yProps(0)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="تایید شده"
                    {...a11yProps(1)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="رد شده"
                    {...a11yProps(2)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="در انتظار بررسی"
                    {...a11yProps(3)}
                />
            </Tabs>

            {!visas ? (
                <OmProgress />
            ) : visas && visas.length > 0 ? (
                <div className="panel-inner-content">
                    <CustomTabPanel value={value} index={0}>
                        {visas.map((visa) => (
                            <VisaRow key={visa._id} visa={visa} />
                        ))}

                        <div className="pagination-container">
                            <Pagination
                                page={page}
                                count={Math.ceil(total / limit)}
                                onChange={handlePaginationClick}
                                showFirstButton
                                showLastButton
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        {visas.map((visa) => (
                            <VisaRow key={visa._id} visa={visa} />
                        ))}
                        <div className="pagination-container">
                            <Pagination
                                page={page}
                                count={Math.ceil(total / limit)}
                                onChange={handlePaginationClick}
                                showFirstButton
                                showLastButton
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        {visas.map((visa) => (
                            <VisaRow key={visa._id} visa={visa} />
                        ))}
                        <div className="pagination-container">
                            <Pagination
                                page={page}
                                count={Math.ceil(total / limit)}
                                onChange={handlePaginationClick}
                                showFirstButton
                                showLastButton
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        {visas.map((visa) => (
                            <VisaRow key={visa._id} visa={visa} />
                        ))}

                        <div className="pagination-container">
                            <Pagination
                                page={page}
                                count={Math.ceil(total / limit)}
                                onChange={handlePaginationClick}
                                showFirstButton
                                showLastButton
                                color="primary"
                                shape="rounded"
                                size="large"
                            />
                        </div>
                    </CustomTabPanel>
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
}
