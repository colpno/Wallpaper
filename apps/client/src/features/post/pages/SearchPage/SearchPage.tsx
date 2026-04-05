import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import MasonryLayout from "@/components/common/MasonryLayout";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { INFINITE_PAGE_SIZE, INITIAL_PAGE } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PostCard from "../../components/PostCard";
import { searchPostsQueryOptions } from "../../services/api/queries";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    ...searchPostsQueryOptions({ text: qParam }, { page: INITIAL_PAGE, limit: INFINITE_PAGE_SIZE }),
    enabled: !!qParam,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <Container as="section" className="pt-11">
      {isLoading ? (
        <div>Skeletons here</div>
      ) : data ? (
        <MasonryLayout>
          {data.map((item) => (
            <PostCard key={item._id} {...item} />
          ))}
        </MasonryLayout>
      ) : (
        <Heading variant="h2" className="text-center">
          No search results meet your criteria
        </Heading>
      )}
    </Container>
  );
}

export default SearchPage;
