'use client';

import IsLoading from '@/components/common/IsLoading';
import adminGetAllDocuments from '@/functions/admin/dcoument/adminGetAllDocuments';
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
import DocumentRow from '@/components/common/DocumentRow';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`documents-tabpanel-${index}`}
            aria-labelledby={`documents-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="documents-wrapper">{children}</div>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `documents-tab-${index}`,
        'aria-controls': `documents-tabpanel-${index}`,
    };
}

export default function DocumentManagementPage() {
    const [documents, setDocuments] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [status, setStatus] = useState('all');
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setDocuments(null);
        setPage(1);
        if (newValue === 1) {
            setStatus('approved');
        } else if (newValue === 2) {
            setStatus('rejected');
        } else if (newValue === 3) {
            setStatus('pending');
        } else if (newValue === 4) {
            setStatus('underReview');
        } else {
            setStatus('all');
        }
    };

    const getDocuments = useCallback(async () => {
        if (status === undefined) return;
        const data = {
            status,
            page,
            limit,
        };
        await adminGetAllDocuments(
            dispatch,
            enqueueSnackbar,
            setDocuments,
            setTotal,
            data
        );
    }, [dispatch, enqueueSnackbar, limit, page, status]);

    const handlePaginationClick = (event, value) => {
        setDocuments(null);
        setPage(value);
    };

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    if (documents === null) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدارک و فایل ها</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید مدارک بارگذاری شده را مشاهده نمایید
                        .
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
                    label="همه فایل ها"
                    {...a11yProps(0)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="در انتظار تایید"
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
                    label="در انتظار متقاضی"
                    {...a11yProps(3)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="در انتظار بررسی"
                    {...a11yProps(4)}
                />
            </Tabs>

            {!documents ? (
                <OmProgress />
            ) : documents && documents.length > 0 ? (
                <div className="panel-inner-content">
                    <CustomTabPanel value={value} index={0}>
                        {documents.map((document) => (
                            <DocumentRow
                                key={document._id}
                                document={document}
                            />
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
                        {documents.map((document) => (
                            <DocumentRow
                                key={document._id}
                                document={document}
                            />
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
                        {documents.map((document) => (
                            <DocumentRow
                                key={document._id}
                                document={document}
                            />
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
                        {documents.map((document) => (
                            <DocumentRow
                                key={document._id}
                                document={document}
                            />
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
                    <CustomTabPanel value={value} index={4}>
                        {documents.map((document) => (
                            <DocumentRow
                                key={document._id}
                                document={document}
                            />
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
