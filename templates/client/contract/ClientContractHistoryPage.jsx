'use client';

import { useEffect, useState } from 'react';
import useCommonHooks from '@/hooks/useCommonHooks';
import useContract from '@/hooks/useContract';
import { dateTimeFormatter } from '@/utils/dateTimeFormatter';
import getContractDataByType from '@/functions/contract/getContractDataByType';
import ClientContractNavigation from '@/components/common/ClientContractNavigation';
import IsLoading from '@/components/common/IsLoading';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import MessageIcon from '@mui/icons-material/Message';
import CancelIcon from '@mui/icons-material/Cancel';

function StepIcon(props) {
    const { type } = props;
    let icon;

    switch (type) {
        case 'create':
            icon = <AddCircleOutlineIcon />;
            break;

        case 'update':
            icon = <UpdateIcon />;
            break;

        case 'delete':
            icon = <DeleteForeverIcon />;
            break;

        case 'download':
            icon = <DownloadIcon />;
            break;

        case 'upload':
            icon = <UploadIcon />;
            break;

        case 'approve':
            icon = <AddTaskIcon />;
            break;

        case 'reject':
            icon = <ThumbDownOffAltIcon />;
            break;

        case 'message':
            icon = <MessageIcon />;
            break;

        case 'close':
            icon = <CancelIcon />;
            break;

        default:
            icon = <AddCircleOutlineIcon />;
            break;
    }
    return icon;
}

export default function ClientContractHistoryPage({ contractNo }) {
    const [activities, setActivities] = useState(null);

    const { contract } = useContract(contractNo);

    const { dispatch, enqueueSnackbar, userData } = useCommonHooks();

    useEffect(() => {
        if (contract) {
            async function fetchData() {
                const data = {
                    type: 'activities',
                    contractId: contract._id,
                };
                await getContractDataByType(
                    dispatch,
                    enqueueSnackbar,
                    setActivities,
                    data
                );
            }
            fetchData();
        }
    }, [contract, dispatch, enqueueSnackbar]);

    if (!contract || activities === null) {
        return <IsLoading isLoading={true} />;
    }

    return (
        <div className="contract-page">
            <ClientContractNavigation contractNo={contractNo} />
            <div className="contract-page-content">
                <div className="history-wrapper">
                    <Stepper orientation="vertical">
                        {activities.map((step) => (
                            <Step
                                key={step._id}
                                className={
                                    step.performedByModel === 'User'
                                        ? 'user-activity'
                                        : 'client-activity'
                                }
                            >
                                <StepLabel
                                    StepIconComponent={StepIcon}
                                    StepIconProps={{
                                        type: step.action,
                                    }}
                                >
                                    <Typography variant="body1">
                                        {step.performedBy.firstName +
                                            ' ' +
                                            step.performedBy.lastName}
                                    </Typography>
                                    <Typography variant="body2">
                                        ({dateTimeFormatter(step.createdAt)})
                                    </Typography>
                                </StepLabel>
                                <StepContent
                                    TransitionProps={{ unmountOnExit: false }}
                                >
                                    <div className="activity-item">
                                        <Typography variant="body1">
                                            {step.details}
                                        </Typography>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
        </div>
    );
}
