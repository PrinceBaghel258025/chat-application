import { Skeleton } from '@chakra-ui/react';
import React from 'react'

interface ISkeletonLoaderProps  {
    count: Number
    height: string;
    width: string
}

const SkeletonLoader : React.FC<ISkeletonLoaderProps> = ({count, height, width}) => {
  return (
        <>
            {[...Array(count)].map((_, i) => (
                <Skeleton key={i}
                height={height}
                width={{base: 'full'}}
                startColor="blackAlpha.400"
                endColor='whiteAlpha.300'
                borderRadius={'full'} />
            ))}
        </>
  )
}

export default SkeletonLoader