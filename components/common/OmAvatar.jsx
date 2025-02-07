import Image from 'next/image';
import React from 'react';
import OmImage from '@/components/common/OmIamge';

export default function OmAvatar({ person, width = 50, height = 50 }) {
    return (
        <div className="om-avatar">
            {person.avatar.url === '' ? (
                <Image
                    src="/assets/images/misc/avatar.png"
                    alt={person.firstName}
                    width={width}
                    height={height}
                    style={{
                        borderRadius: '50%',
                        minWidth: width,
                        minHeight: height,
                    }}
                />
            ) : (
                <OmImage
                    name={person.avatar}
                    variant="circle"
                    width={width}
                    height={height}
                />
            )}
        </div>
    );
}
