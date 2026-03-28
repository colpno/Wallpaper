import {
  Masonry,
  type MasonryProps,
  useInfiniteLoader,
  type UseInfiniteLoaderOptions,
} from "masonic";
import { useCallback, useEffect, useRef, useState } from "react";

type Args<T> = {
  fetcher: (page: number) => Promise<T[]>;
  /**
   * @default 1
   */
  initialPage?: number;
  /**
   * @default 30
   */
  pageSize?: number;
} & Pick<UseInfiniteLoaderOptions<T>, "threshold" | "totalItems">;

const useMasonryInfinite = <T extends object>({
  fetcher,
  initialPage = 1,
  pageSize = 30,
  ...args
}: Args<T>) => {
  const [accItems, setAccItems] = useState<T[]>([]);
  const pageRef = useRef<number>(initialPage);

  // fetch initial page
  useEffect(() => {
    let mounted = true;
    fetcher(initialPage).then((res) => {
      if (!mounted) return;
      setAccItems(res);
    });
    return () => {
      mounted = false;
    };
  }, [initialPage]);

  const fetchMoreItems = useCallback(async () => {
    const nextPage = pageRef.current + 1;
    const nextItems = await fetcher(nextPage);
    pageRef.current = nextPage;
    setAccItems((cur) => cur.concat(nextItems));
  }, []);
  const isItemLoaded = useCallback((index: number, itemsArr: T[]) => !!itemsArr[index], []);

  const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
    isItemLoaded,
    minimumBatchSize: pageSize,
    threshold: args.threshold ?? 1,
    totalItems: args.totalItems,
  });

  return {
    /**
     * The accumulated items loaded so far.
     */
    allItems: accItems,
    /**
     * The current page number.
     */
    page: pageRef.current,
    /**
     * The Masonry component with infinite loading enabled.
     */
    Masonry: (props: Omit<MasonryProps<T>, "items" | "onRender">) => (
      <Masonry {...props} items={accItems} onRender={maybeLoadMore} />
    ),
  };
};

export default useMasonryInfinite;
