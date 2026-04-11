import { toast } from "@repo/ui/components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { Navigate, useParams } from "react-router";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Spinner from "@/components/ui/Spinner";
import { INFINITE_PAGE_SIZE, MAX_SIMILARITY_SCORE, ROUTES } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PinCard from "../../components/PinCard";
import PinCardSkeleton from "../../components/PinCard/PinCardSkeleton";
import { getPinByIdQueryOptions, searchPinsInfiniteQueryOptions } from "../../services/api/queries";
import PinInfo from "./components/PinInfo";

function PinPage() {
  const { pinId } = useParams();
  const lastSmallestScore = useRef(MAX_SIMILARITY_SCORE);

  const {
    data: pin,
    isFetched: isPinFetched,
    isFetching: isFetchingPin,
  } = useQuery({
    ...getPinByIdQueryOptions(
      { id: pinId! },
      {
        select: {
          _id: false,
          descriptionEmbeddings: true,
          photoUrl: true,
          photoWidth: true,
          photoAspectRatio: true,
        },
      }
    ),
    enabled: !!pinId,
  });

  const {
    data: similarPins,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading: isLoadingSimilarPins,
  } = useInfiniteQuery({
    ...searchPinsInfiniteQueryOptions(
      { embedding: pin?.descriptionEmbeddings ?? [] },
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
    enabled: !!pin?.descriptionEmbeddings,
  });

  if (similarPins?.[similarPins.length - 1]) {
    lastSmallestScore.current = similarPins[similarPins.length - 1].score;
  }

  const { loadMoreRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  const masonryItems = useMemo(() => {
    if (isFetchingPin || isLoadingSimilarPins) {
      return (
        <>
          <MasonryWrapper className="col-span-3">
            <PinCardSkeleton />
          </MasonryWrapper>

          {Array.from({ length: INFINITE_PAGE_SIZE }).map((_, i) => (
            <MasonryWrapper key={`skeleton-${i}`}>
              <PinCardSkeleton />
            </MasonryWrapper>
          ))}
        </>
      );
    }

    if (!pin || !similarPins) {
      return null;
    }

    return (
      <>
        <MasonryWrapper className="col-span-3">
          <PinInfo {...pin} />
        </MasonryWrapper>

        {similarPins.map((item) => (
          <MasonryWrapper key={item._id}>
            <PinCard {...item} />
          </MasonryWrapper>
        ))}

        {isFetchingNextPage && <Spinner className="mx-auto mt-8" />}
        <div ref={loadMoreRef} />
      </>
    );
  }, [isLoadingSimilarPins, isFetchingPin, pin, similarPins]);

  if (!pinId || (isPinFetched && !pin)) {
    toast.info("We can't find that idea! Try searching for one just like it.");
    return <Navigate to={ROUTES.IDEAS()} />;
  }

  return (
    <Container as="section" className="pt-11">
      <Masonry>{masonryItems}</Masonry>
    </Container>
  );
}

export default PinPage;
