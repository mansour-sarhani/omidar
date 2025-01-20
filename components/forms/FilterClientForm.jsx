import useCommonHooks from '@/hooks/useCommonHooks';
import adminFilterClients from '@/functions/admin/clients/adminFilterClients';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function FilterClientForm(props) {
    const {
        setClients,
        setOpen,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        mobile,
        setMobile,
    } = props;

    const { dispatch, enqueueSnackbar } = useCommonHooks();

    const onSubmit = async () => {
        const data = {
            firstName,
            lastName,
            email,
            mobile,
        };
        await adminFilterClients(dispatch, enqueueSnackbar, setClients, data);
        setOpen(false);
    };

    const resetFilter = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobile('');
    };

    return (
        <div className="filter-form">
            <FormControl sx={{ width: '100%', marginBottom: '1rem' }}>
                <label>نام</label>
                <TextField
                    hiddenLabel
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    size="small"
                />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '1rem' }}>
                <label>نام خانوادگی</label>
                <TextField
                    hiddenLabel
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    size="small"
                />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '1rem' }}>
                <label>شماره موبایل</label>
                <TextField
                    hiddenLabel
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    size="small"
                />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '1rem' }}>
                <label>ایمیل</label>
                <TextField
                    hiddenLabel
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                />
            </FormControl>
            <Button
                onClick={onSubmit}
                variant="contained"
                color="primary"
                style={{ marginTop: '1rem' }}
            >
                <ManageSearchIcon />
                جستجو
            </Button>

            <Button
                onClick={resetFilter}
                variant="outlined"
                color="error"
                style={{ marginTop: '1rem' }}
            >
                <RestartAltIcon />
                ریست فیلترها
            </Button>
        </div>
    );
}
