'use client';

import ClientLoginForm from '@/components/forms/ClientLoginForm';
import Typography from '@mui/material/Typography';

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="full-bg-container">
                <div className="om-container">
                    <div className="home-page-wrapper">
                        <div className="home-intro">
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                            >
                                گروه مهاجرتی VISTA
                            </Typography>
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                            >
                                ورود متقاضیان به پورتال مدیریت قرارداد
                            </Typography>
                        </div>
                        <div className="home-login-form">
                            <ClientLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
