import { memo, useState } from 'react';
import Image from 'next/image';
import { lazyLoadImage } from '@/utils/performance';

const OptimizedImage = memo(function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    quality = 75,
    placeholder = 'blur',
    blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    className = '',
    style = {},
    onLoad,
    onError,
    ...props
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = (event) => {
        setIsLoading(false);
        onLoad?.(event);
    };

    const handleError = (event) => {
        setIsLoading(false);
        setHasError(true);
        onError?.(event);
    };

    // Generate responsive sizes based on width
    const generateSizes = (width) => {
        if (width <= 100) return '100px';
        if (width <= 300) return '(max-width: 768px) 200px, 300px';
        if (width <= 600) return '(max-width: 768px) 300px, 600px';
        return '(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 25vw';
    };

    const sizes = props.sizes || generateSizes(width);

    return (
        <div 
            className={`optimized-image-container ${className}`}
            style={{ 
                position: 'relative', 
                display: 'inline-block',
                ...style 
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                quality={quality}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                sizes={sizes}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    transition: 'opacity 0.3s ease',
                    opacity: isLoading ? 0.7 : 1,
                }}
                {...props}
            />
            {hasError && (
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        color: '#666',
                        fontSize: '12px',
                    }}
                >
                    تصویر بارگذاری نشد
                </div>
            )}
        </div>
    );
});

export default OptimizedImage;