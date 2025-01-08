import '../styles/styles.css';

import localFont from 'next/font/local';
import theme from './theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ReduxProvider from '@/providers/ReduxProvider';
import SnackProvider from '@/providers/SnackProvider';
import { SocketProvider } from '@/providers/SocketProvider';

const vazir = localFont({
    src: '../public/assets/fonts/Vazir-Regular-FD.woff2',
    variable: '--font-vazir',
    weight: '400',
    style: 'normal',
});

const vazirBold = localFont({
    src: '../public/assets/fonts/Vazir-Bold-FD.woff2',
    variable: '--font-vazir-bold',
    weight: 'bold',
    style: 'normal',
});

export const metadata = {
    title: 'Omidar Migration',
    description: 'CRM PANEL',
};

export default function RootLayout({ children }) {
    return (
        <html lang="fa">
            <body className={`${vazir.variable} ${vazirBold.variable}`}>
                <ReduxProvider>
                    <AppRouterCacheProvider>
                        <SocketProvider>
                            <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <SnackProvider>{children}</SnackProvider>
                            </ThemeProvider>
                        </SocketProvider>
                    </AppRouterCacheProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
