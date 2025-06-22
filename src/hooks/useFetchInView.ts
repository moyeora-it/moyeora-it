import { FetchNextPageOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';

export const useFetchInView = ({
  fetchNextPage,
  options,
  isLoading,
  isFetchingNextPage,
}: {
  fetchNextPage: (options?: FetchNextPageOptions) => void;
  options?: IntersectionOptions;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
}) => {
  const { ref, inView } = useInView({ ...options });

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line
  }, [inView]);

  return { ref };
};
