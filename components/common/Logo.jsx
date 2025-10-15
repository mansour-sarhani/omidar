import Image from 'next/image';

export default function Logo({ color, width = 60, height = 60 }) {
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
        />
    );
}
