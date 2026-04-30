import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { Navigate, useSearchParams } from "react-router";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Spinner from "@/components/ui/Spinner";
import { INFINITE_PAGE_SIZE, MAX_SIMILARITY_SCORE, ROUTES } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PinCard from "../../pin/components/PinCard";
import PinCardSkeleton from "../../pin/components/PinCard/PinCardSkeleton";
import { searchPinsInfiniteQueryOptions } from "../../pin/services/api/queries";

function SearchPage() {
  const lastSmallestScore = useRef(MAX_SIMILARITY_SCORE);
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    ...searchPinsInfiniteQueryOptions(
      { text: qParam },
      {
        lastSmallestScore: lastSmallestScore.current,
        limit: INFINITE_PAGE_SIZE,
        select: {
          pinTitle: true,
          pinDescription: true,
          photoUrl: true,
          photoBlurHash: true,
          photoAspectRatio: true,
          photoWidth: true,
        },
      }
    ),
    enabled: !!qParam,
  });

  if (data?.[data.length - 1]) {
    lastSmallestScore.current = data[data.length - 1]!.score;
  }

  const { loadMoreRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  const masonryItems = useMemo(() => {
    if (isLoading) {
      return (
        <Masonry className="grid-cols-[repeat(auto-fill,min(225px,max(1fr,230px)))]">
          {Array.from({ length: INFINITE_PAGE_SIZE }).map((_, i) => (
            <MasonryWrapper key={`skeleton-${i}`}>
              <PinCardSkeleton />
            </MasonryWrapper>
          ))}
        </Masonry>
      );
    }

    if (data) {
      return (
        <>
          <Masonry>
            {data.map((item) => (
              <MasonryWrapper key={item._id}>
                <PinCard item={item} />
              </MasonryWrapper>
            ))}
          </Masonry>

          {isFetchingNextPage && <Spinner className="mx-auto mt-8" />}
          <div ref={loadMoreRef} />
        </>
      );
    }

    return <Navigate to={ROUTES.EXPLORE()} />;
  }, [isLoading, data]);

  return <Container className="max-w-none">{masonryItems}</Container>;
}

export default SearchPage;
