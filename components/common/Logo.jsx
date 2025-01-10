import Image from 'next/image';

export default function Logo({ color, width = 60, height = 60 }) {
    return (
        <Image
            src={`/assets/images/misc/logo-150x150.png`}
            width={width}
            height={height}
            alt="امیدار"
            className="logo"
        />
    );
}
