import '../styles/styles.css';

import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
import theme from './theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Dynamic imports for better code splitting
const ReduxProvider = dynamic(() => import('@/providers/ReduxProvider'), {
    ssr: true,
});

const SnackProvider = dynamic(() => import('@/providers/SnackProvider'), {
    ssr: false,
    loading: () => null,
});

const SocketProvider = dynamic(() => import('@/providers/SocketProvider').then(mod => ({ default: mod.SocketProvider })), {
    ssr: false,
    loading: () => null,
});

const vazir = localFont({
    src: '../public/assets/fonts/Vazir-Regular-FD.woff2',
    variable: '--font-vazir',
    weight: '400',
    style: 'normal',
    display: 'swap',
    preload: true,
});

const vazirBold = localFont({
    src: '../public/assets/fonts/Vazir-Bold-FD.woff2',
    variable: '--font-vazir-bold',
    weight: 'bold',
    style: 'normal',
    display: 'swap',
    preload: true,
});

export const metadata = {
    title: 'Omidar Migration',
    description: 'CRM PANEL',
    keywords: 'migration, crm, panel, omidar',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#003399',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        title: 'Omidar Migration',
        description: 'CRM PANEL',
        type: 'website',
        locale: 'fa_IR',
    },
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
