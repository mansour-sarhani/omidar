import FA from '@/utils/localizationFa';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import PendingIcon from '@mui/icons-material/Pending';

export default function setStatusLabel(status) {
    switch (status) {
        case 'active':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label={FA.status.active}
                    color="success"
                />
            );

        case 'approved':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label={FA.status.approved}
                    color="success"
                />
            );

        case 'published':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label={FA.status.published}
                    color="success"
                />
            );

        case 'done':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label={FA.status.done}
                    color="success"
                />
            );

        case 'completed':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label={FA.status.completed}
                    color="success"
                />
            );

        case 'processing':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.processing}
                    color="warning"
                />
            );

        case 'left':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.left}
                    color="warning"
                />
            );

        case 'arrived':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.arrived}
                    color="warning"
                />
            );

        case 'pickedUp':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.pickedUp}
                    color="warning"
                />
            );

        case 'pending':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.pending}
                    color="warning"
                />
            );

        case 'underReview':
            return (
                <Chip
                    icon={<PendingIcon />}
                    label={FA.status.underReview}
                    color="warning"
                />
            );

        case 'inactive':
            return (
                <Chip
                    icon={<CancelIcon />}
                    label={FA.status.inactive}
                    color="error"
                />
            );

        case 'rejected':
            return (
                <Chip
                    icon={<CancelIcon />}
                    label={FA.status.rejected}
                    color="error"
                />
            );

        case 'banned':
            return (
                <Chip
                    icon={<BlockIcon />}
                    label={FA.status.banned}
                    color="default"
                />
            );

        case 'canceled':
            return (
                <Chip
                    icon={<BlockIcon />}
                    label={FA.status.canceled}
                    color="default"
                />
            );

        default:
            return (
                <Chip icon={<InfoIcon />} label={FA.status.NA} color="info" />
            );
    }
}
