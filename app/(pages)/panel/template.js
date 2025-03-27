'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { setViewPort } from '@/redux/features/settingsSlice';
import IsLoading from '@/components/common/IsLoading';
import { useMediaQuery } from '@mui/system';
import getCurrentClient from '@/functions/client/getCurrentClient';
import PanelHeader from '@/layouts/panel/header/PanelHeader';
import PanelSidebar from '@/layouts/panel/sidebar/PanelSidebar';
import useCommonHooks from '@/hooks/useCommonHooks';

export default function ClientTemplate({ children }) {
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { router, pathname, dispatch, enqueueSnackbar } = useCommonHooks();

    const isDesktop = useMediaQuery('(min-width:992px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:991px)');
    const isMobile = useMediaQuery('(max-width:480px)');

    const currentToken = Cookies.get('om_token');

    useEffect(() => {
        if (currentToken) {
            setIsLoading(true);
            async function fetchClient() {
                try {
                    await getCurrentClient(
                        dispatch,
                        enqueueSnackbar,
                        setClient
                    );
                } catch (error) {
                    setClient(false);
                    Cookies.remove('om_token');
                } finally {
                    setIsLoading(false);
                }
            }
            fetchClient();
        } else {
            setClient(false);
        }
    }, [currentToken, dispatch, enqueueSnackbar]);

    useEffect(() => {
        if (isDesktop) {
            dispatch(setViewPort({ viewPort: 'desktop' }));
        } else if (isTablet) {
            dispatch(setViewPort({ viewPort: 'tablet' }));
        } else if (isMobile) {
            dispatch(setViewPort({ viewPort: 'mobile' }));
        }
    }, [isDesktop, isTablet, isMobile, dispatch]);

    useEffect(() => {
        if (client === false && pathname.startsWith('/panel/')) {
            router.push('/');
        }
    }, [client, pathname, router]);

    return isLoading || client === null ? (
        <IsLoading isLoading={true} />
    ) : (
        <div className="main">
            <div className="panel-page-wrapper">
                <div className="panel-header">
                    <PanelHeader client={client} />
                </div>
                {isDesktop && client && (
                    <div className="panel-sidebar">
                        <PanelSidebar client={client} />
                    </div>
                )}
                <div className="panel-content">{children}</div>
            </div>
        </div>
    );
}
