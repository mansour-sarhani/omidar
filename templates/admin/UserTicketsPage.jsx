'use client';

import useCommonHooks from '@/hooks/useCommonHooks';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import getAllTickets from '@/functions/user/getAllTickets';
import NoData from '@/components/common/NoData';
import IsLoading from '@/components/common/IsLoading';
import TicketRow from '@/components/common/TicketRow';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OmProgress from '@/components/common/OmProgress';
import ChatIcon from '@mui/icons-material/Chat';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tickets-tabpanel-${index}`}
            aria-labelledby={`tickets-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="tickets-wrapper">{children}</div>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `tickets-tab-${index}`,
        'aria-controls': `tickets-tabpanel-${index}`,
    };
}

export default function UserTicketsPage() {
    const [tickets, setTickets] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [status, setStatus] = useState('all');
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const { dispatch, enqueueSnackbar, router } = useCommonHooks();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setTickets(null);
        setPage(1);
        if (newValue === 1) {
            setStatus('waitingOnClient');
        } else if (newValue === 2) {
            setStatus('waitingOnUser');
        } else {
            setStatus('all');
        }
    };

    const getTickets = useCallback(async () => {
        if (status === undefined) return;
        const data = {
            status,
            page,
            limit,
        };
        await getAllTickets(
            dispatch,
            enqueueSnackbar,
            setTickets,
            setTotal,
            data
        );
    }, [dispatch, enqueueSnackbar, limit, page, status]);

    const handlePaginationClick = (event, value) => {
        setTickets(null);
        setPage(value);
    };

    useEffect(() => {
        getTickets();
    }, [getTickets]);

    if (tickets === null) return <IsLoading isLoading={true} />;

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">تیکت های پشتیبانی</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید تیکت ها را مشاهده نمایید و تیکت
                        جدید ارسال کنید.
                    </Typography>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    href="/admin/ticket/new"
                >
                    <RateReviewIcon />
                    تیکت جدید
                </Button>
            </div>
            <Tabs value={value} onChange={handleChange}>
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="همه تیکت ها"
                    {...a11yProps(0)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="در انتظار متقاضی"
                    {...a11yProps(1)}
                />
                <Tab
                    icon={<ChatIcon />}
                    iconPosition="start"
                    label="در انتظار کارشناس"
                    {...a11yProps(2)}
                />
            </Tabs>

            {!tickets ? (
                <OmProgress />
            ) : tickets && tickets.length > 0 ? (
                <div className="panel-inner-content">
                    <CustomTabPanel value={value} index={0}>
                        {tickets.map((ticket) => (
                            <TicketRow
                                key={ticket._id}
                                ticket={ticket}
                                type={'admin'}
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
                        {tickets.map((ticket) => (
                            <TicketRow
                                key={ticket._id}
                                ticket={ticket}
                                type={'admin'}
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
                        {tickets.map((ticket) => (
                            <TicketRow
                                key={ticket._id}
                                ticket={ticket}
                                type={'admin'}
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
