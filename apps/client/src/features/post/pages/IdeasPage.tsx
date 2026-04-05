import { useInfiniteQuery } from "@tanstack/react-query";

import MasonryLayout from "@/components/common/MasonryLayout";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { INFINITE_PAGE_SIZE, INITIAL_PAGE } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PostCard from "../components/PostCard";
import { getPostsInfiniteQueryOptions } from "../services/api/queries";

function IdeasPage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    getPostsInfiniteQueryOptions({
      page: INITIAL_PAGE,
      limit: INFINITE_PAGE_SIZE,
      sort: {
        createdAt: "asc",
      },
      select: {
        photoUrl: true,
        photoBlurHash: true,
        postTitle: true,
        postDescription: true,
      },
    })
  );

  useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <Container as="section" className="pt-11">
      {isLoading ? (
        <Heading variant="h2" className="text-center">
          Loading today&apos;s picks...
        </Heading>
      ) : data ? (
        <>
          <Heading variant="h2">What&apos;s new on Pinterest</Heading>

          <MasonryLayout>
            {data.map((item) => (
              <PostCard key={item._id} {...item} />
            ))}
          </MasonryLayout>
        </>
      ) : (
        <Heading variant="h2" className="text-center">
          Today&apos;s picks have nothing
        </Heading>
      )}
    </Container>
  );
}

export default IdeasPage;
