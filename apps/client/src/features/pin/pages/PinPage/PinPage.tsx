import { toast } from "@repo/ui/components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Navigate, useNavigate, useParams } from "react-router";

import { useStore } from "@/app/stores/useStore";
import LoginDialogForm from "@/components/common/LoginDialogForm";
import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Button from "@/components/ui/Button";
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
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const {
    data: pin,
    isFetched: isPinFetched,
    isFetching: isFetchingPin,
  } = useQuery({
    ...getPinByIdQueryOptions(
      { id: pinId! },
      {
        embed: "pinOwner",
        select: {
          _id: true,
          pinTitle: true,
          pinDescription: true,
          pinOwner: true,
          descriptionEmbeddings: true,
          photoUrl: true,
          photoWidth: true,
          photoHeight: true,
          photoAspectRatio: true,
        },
      }
    ),
    enabled: !!pinId && !!user,
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
    enabled: !!pin?.descriptionEmbeddings && !!user,
  });

  if (similarPins?.[similarPins.length - 1]) {
    lastSmallestScore.current = similarPins[similarPins.length - 1]!.score;
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
        <MasonryWrapper className="col-span-3" observeResize>
          <PinInfo {...pin} />
        </MasonryWrapper>

        {similarPins.map((item) => (
          <MasonryWrapper key={item._id}>
            <PinCard item={item} />
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

  if (!user) {
    return <LoginDialogForm open={true} showCloseButton={false} />;
  }

  return (
    <Container as="section" className="grid max-w-none grid-cols-18">
      <Button
        variant="ghost"
        size="icon-xl"
        className="col-span-1 size-16"
        onClick={() => navigate(-1)}
      >
        <GoArrowLeft />
      </Button>

      <Masonry className="col-span-16">{masonryItems}</Masonry>
    </Container>
  );
}

export default PinPage;
