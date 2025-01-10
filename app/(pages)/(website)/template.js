'use client';

import { useEffect } from 'react';
import { setViewPort } from '@/redux/features/settingsSlice';
import useCommonHooks from '@/hooks/useCommonHooks';
import { useMediaQuery } from '@mui/system';
import FrontHeader from '@/layouts/front/header/FrontHeader';

export default function WebsiteTemplate({ children }) {
    const { dispatch } = useCommonHooks();

    const isDesktop = useMediaQuery('(min-width:992px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:991px)');
    const isMobile = useMediaQuery('(max-width:480px)');

    useEffect(() => {
        if (isDesktop) {
            dispatch(setViewPort({ viewPort: 'desktop' }));
        } else if (isTablet) {
            dispatch(setViewPort({ viewPort: 'tablet' }));
        } else if (isMobile) {
            dispatch(setViewPort({ viewPort: 'mobile' }));
        }
    }, [isDesktop, isTablet, isMobile, dispatch]);

    return (
        <div className="main">
            <FrontHeader />
            {children}
        </div>
    );
}
