import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    
    // Performance optimizations
    swcMinify: true,
    poweredByHeader: false,
    
    // Compression and optimization
    compress: true,
    
    // Bundle analyzer (uncomment for analysis)
    // bundleAnalyzer: {
    //     enabled: process.env.ANALYZE === 'true',
    // },
    
    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Experimental features for performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            '@mui/material',
            '@mui/icons-material',
            'lodash',
            'date-fns',
            'dayjs'
        ],
    },
    
    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Production optimizations
        if (!dev && !isServer) {
            // Bundle splitting for better caching
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Vendor chunk for stable libraries
                        vendor: {
                            name: 'vendor',
                            chunks: 'all',
                            test: /node_modules/,
                            priority: 20,
                        },
                        // MUI chunk
                        mui: {
                            name: 'mui',
                            chunks: 'all',
                            test: /[\\/]node_modules[\\/]@mui[\\/]/,
                            priority: 30,
                        },
                        // Common chunk for shared components
                        common: {
                            name: 'common',
                            minChunks: 2,
                            chunks: 'all',
                            priority: 10,
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        
        return config;
    },
    
    // Headers for performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    }
                ],
            },
            {
                source: '/assets/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ],
            },
        ];
    },
};

export default withBundleAnalyzer(nextConfig);
