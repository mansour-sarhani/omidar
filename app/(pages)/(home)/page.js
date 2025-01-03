import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Home() {
    return (
        <div>
            <Typography variant="h1">درباره امیدار</Typography>
            <Typography variant="body1">درباره امیدار</Typography>
            <Button
                variant="contained"
                color="primary"
                href="/auth/client/login"
            >
                ورود متقاضی به پنل
            </Button>
            <Button
                variant="contained"
                color="secondary"
                href="/auth/admin/login"
            >
                ورود کاربر به پنل
            </Button>
        </div>
    );
}
