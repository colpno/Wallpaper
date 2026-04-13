import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { Navigate, useSearchParams } from "react-router";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Spinner from "@/components/ui/Spinner";
import { INFINITE_PAGE_SIZE, MAX_SIMILARITY_SCORE, ROUTES } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PinCard from "../components/PinCard";
import PinCardSkeleton from "../components/PinCard/PinCardSkeleton";
import { searchPinsInfiniteQueryOptions } from "../services/api/queries";

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
                <PinCard {...item} />
              </MasonryWrapper>
            ))}
          </Masonry>

          {isFetchingNextPage && <Spinner className="mx-auto mt-8" />}
          <div ref={loadMoreRef} />
        </>
      );
    }

    return <Navigate to={ROUTES.IDEAS()} />;
  }, [isLoading, data]);

  if (data?.[data.length - 1]) {
    lastSmallestScore.current = data[data.length - 1]!.score;
  }

  return <section className="px-4 pt-11">{masonryItems}</section>;
}

export default SearchPage;
