import { memo } from 'react';
import Image from 'next/image';

const Logo = memo(function Logo({ color, width = 60, height = 60, priority = false }) {
    return (
        <Image
            src={
                color === 'white'
                    ? `/assets/images/misc/vista-logo-light.webp`
                    : `/assets/images/misc/vista-logo-150.webp`
            }
            width={width}
            height={height}
            alt="امیدار"
            className="logo"
            priority={priority}
            sizes="(max-width: 768px) 40px, 60px"
        />
    );
});

export default Logo;
