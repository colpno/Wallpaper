import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Spinner from "@/components/ui/Spinner";
import { INFINITE_PAGE_SIZE } from "@/constants/common";
import PinCard from "@/features/pin/components/PinCard";
import PinCardSkeleton from "@/features/pin/components/PinCard/PinCardSkeleton";
import { getPinsInfiniteQueryOptions } from "@/features/pin/services/api/queries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

function UserHomePage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    getPinsInfiniteQueryOptions({
      limit: INFINITE_PAGE_SIZE,
      sort: { createdAt: "desc" },
      select: {
        pinOwner: true,
        pinTitle: true,
        pinDescription: true,
        photoUrl: true,
        photoBlurHash: true,
        photoAspectRatio: true,
        photoWidth: true,
      },
    })
  );

  const { loadMoreRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  const masonryItems = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: INFINITE_PAGE_SIZE }).map((_, i) => (
        <MasonryWrapper key={`skeleton-${i}`}>
          <PinCardSkeleton />
        </MasonryWrapper>
      ));
    }

    if (!data) {
      return null;
    }

    return (
      <>
        {data.map((item) => (
          <MasonryWrapper key={item._id}>
            <PinCard item={item} />
          </MasonryWrapper>
        ))}

        {isFetchingNextPage && <Spinner className="mx-auto mt-8" />}
        <div ref={loadMoreRef} />
      </>
    );
  }, [isLoading, data, isFetchingNextPage]);

  return (
    <Container as="section" className="max-w-none">
      <Masonry>{masonryItems}</Masonry>
    </Container>
  );
}

export default UserHomePage;
