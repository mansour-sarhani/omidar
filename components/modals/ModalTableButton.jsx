import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import TuneIcon from '@mui/icons-material/Tune';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MessageIcon from '@mui/icons-material/Message';
import PasswordIcon from '@mui/icons-material/Password';

function ModalTableButton(props) {
    const { icon, tooltipTitle, handleClickOpen, buttonLabel, variant } = props;

    function renderIcon(icon) {
        switch (icon) {
            case 'add':
                return <AddIcon />;
            case 'comment':
                return <MessageIcon />;
            case 'view':
                return <VisibilityIcon />;
            case 'edit':
                return <EditIcon inert="true" />;
            case 'change':
                return <ChangeCircleIcon />;
            case 'action':
                return <MoreHorizIcon />;
            case 'password':
                return <PasswordIcon />;
            case 'info':
                return <WysiwygIcon />;
            default:
                return <TuneIcon />;
        }
    }

    const buttonIcon = renderIcon(icon);

    return (
        <Tooltip title={tooltipTitle} placement="top" arrow>
            <Button
                onClick={handleClickOpen}
                variant={variant ? variant : 'contained'}
                size="small"
                color={
                    icon === 'edit'
                        ? 'info'
                        : icon === 'password'
                        ? 'error'
                        : 'primary'
                }
            >
                {buttonIcon}
                {buttonLabel}
            </Button>
        </Tooltip>
    );
}

export default ModalTableButton;
