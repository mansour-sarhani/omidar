'use client';

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
                                گروه مهاجرتی امیدار
                            </Typography>
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                            >
                                پنل مدیریت قرارداد
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
