import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import Masonry from "@/components/common/Masonry";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { INFINITE_PAGE_SIZE, INITIAL_PAGE } from "@/constants/common";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import PinCard from "../components/PinCard";
import { searchPinsQueryOptions } from "../services/api/queries";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    ...searchPinsQueryOptions({ text: qParam }, { page: INITIAL_PAGE, limit: INFINITE_PAGE_SIZE }),
    enabled: !!qParam,
  });

  useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <Container as="section" className="pt-11">
      {data ? (
        <Masonry>
          {data.map((item) => (
            <PinCard key={item._id} {...item} />
          ))}
        </Masonry>
      ) : (
        <Heading variant="h2" className="text-center">
          No search results meet your criteria
        </Heading>
      )}
    </Container>
  );
}

export default SearchPage;
