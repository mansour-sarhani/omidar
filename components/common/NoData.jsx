import Image from 'next/image';

export default function NoData() {
    return (
        <div className="no-data">
            <Image
                src="/assets/images/misc/no-data.svg"
                width={700}
                height={537}
                alt="No Data"
            />
        </div>
    );
}
