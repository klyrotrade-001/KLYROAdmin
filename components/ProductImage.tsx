'use client';

import Image, { ImageProps } from 'next/image';

// Allow unoptimized to be passed explicitly (e.g. preview blob URLs)
type ProductImageProps = Omit<ImageProps, 'unoptimized'> & { unoptimized?: boolean };

export default function ProductImage({ src, unoptimized, ...props }: ProductImageProps) {
  const isBase64 = typeof src === 'string' && src.startsWith('data:');
  return <Image src={src} unoptimized={unoptimized ?? isBase64} {...props} />;
}
