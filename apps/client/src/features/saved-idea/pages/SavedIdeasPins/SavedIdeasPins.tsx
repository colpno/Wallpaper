import { cn } from "@repo/ui/lib";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useStore } from "@/app/stores/useStore";
import { PinJar } from "@/assets/images";
import { Masonry, MasonryWrapper } from "@/components/common/Masonry";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import Spinner from "@/components/ui/Spinner";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";
import PinCard from "@/features/pin/components/PinCard";
import { getPinsInfiniteQueryOptions } from "@/features/pin/services/api/queries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import { useSaveIdeasContext } from "../../contexts/savedIdeasContext";

const INFINITE_PAGE_SIZE = 50;

function SavedIdeasPins() {
  const { pin } = useSaveIdeasContext();
  const user = useStore((state) => state.user);

  if (!user) {
    throw new Error("Must be logged in to use this feature");
  }

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    getPinsInfiniteQueryOptions({
      includeSaves: !pin.createdByYou,
      pinOwner: user!.id,
      limit: INFINITE_PAGE_SIZE,
      sort: { createdAt: "desc" },
      select: {
        pinOwner: true,
        pinDescription: true,
        photoUrl: true,
        photoBlurHash: true,
        photoAspectRatio: true,
        photoWidth: true,
      },
    })
  );

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return <Spinner className="mx-auto" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="mx-auto flex w-80 flex-col items-center">
        <Image src={PinJar} alt="Pin jar" className="mb-1 size-46.5" />
        <Typography className="text-xl font-bold">Save what inspires you</Typography>
        <Typography className="text-center text-sm">
          Saving Pins is Pinterest&apos;s superpower. Browse Pins, save what you love, find them
          here to get inspired all over again.
        </Typography>
        <Link to={ROUTES.HOME()} button size="sm" className="mt-3">
          Explore Pins
        </Link>
      </div>
    );
  }

  return (
    <>
      <Masonry
        className={cn(
          "px-4",
          pin.viewOptions === "standard"
            ? "grid-cols-[repeat(auto-fill,minmax(260px,1fr))]!"
            : "grid-cols-[repeat(auto-fill,minmax(150px,1fr))]!"
        )}
      >
        {data.map((item) => (
          <MasonryWrapper key={item._id}>
            <PinCard item={item} showActionButton={false} editable />
          </MasonryWrapper>
        ))}
      </Masonry>

      {isFetchingNextPage && <Spinner className="mx-auto" />}
      {<div ref={loadMoreRef} />}
    </>
  );
}

export default SavedIdeasPins;
