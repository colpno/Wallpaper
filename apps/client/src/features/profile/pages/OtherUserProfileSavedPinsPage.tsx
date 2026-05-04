import { useInfiniteQuery } from "@tanstack/react-query";

import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Spinner from "@/components/ui/Spinner";
import Typography from "@/components/ui/Typography";
import { INFINITE_PAGE_SIZE } from "@/constants/common";
import { useOtherUserProfile } from "@/contexts/otherUserProfileContext";
import { getIdeasInfiniteQueryOptions } from "@/features/idea/services/api/queries";
import PinCard from "@/features/pin/components/PinCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

function OtherUserProfileSavedPinsPage() {
  const { user } = useOtherUserProfile();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    getIdeasInfiniteQueryOptions({
      savedBy: user._id,
      embed: "pin",
      limit: INFINITE_PAGE_SIZE,
    })
  );

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return <Spinner className="mx-auto my-6" />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Container className="max-w-none">
      <Typography className="my-6 text-center text-2xl font-bold">
        More ideas from {user.firstName}
        {user.lastName ? ` ${user.lastName}` : ""}
      </Typography>

      <Masonry>
        {data.map((idea) => (
          <MasonryWrapper key={idea._id}>
            <PinCard item={idea.pin} />
          </MasonryWrapper>
        ))}
      </Masonry>

      {isFetchingNextPage && <Spinner className="mx-auto" />}
      {<div ref={loadMoreRef} />}
    </Container>
  );
}

export default OtherUserProfileSavedPinsPage;
