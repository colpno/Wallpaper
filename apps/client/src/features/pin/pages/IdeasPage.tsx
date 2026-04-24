import { useInfiniteQuery } from "@tanstack/react-query";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Spinner from "@/components/ui/Spinner";
import { INFINITE_PAGE_SIZE } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PinCard from "../components/PinCard";
import { getPinsInfiniteQueryOptions } from "../services/api/queries";

function IdeasPage() {
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

  return (
    <Container as="section" className="pt-11">
      {isLoading ? (
        <>
          <Heading variant="h3" className="mb-10 text-center">
            Loading today&apos;s picks...
          </Heading>

          <Spinner className="mx-auto" />
        </>
      ) : data ? (
        <>
          <Heading variant="h3" className="mb-3">
            What&apos;s new on Pinterest
          </Heading>

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
      ) : (
        <Heading variant="h3" className="text-center">
          Today&apos;s picks have nothing
        </Heading>
      )}
    </Container>
  );
}

export default IdeasPage;
