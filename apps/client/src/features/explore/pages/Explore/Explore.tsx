import type { Post, User } from "@repo/types";
import { Button } from "@repo/ui/components";
import { useCallback } from "react";
import { BsThreeDots } from "react-icons/bs";

import Header from "@/components/layout/Header";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { headerHeight } from "@/constants/components";
import useMasonryInfinite from "@/hooks/useMasonryInfinite";

const item: Post<User> = {
  postTitle:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo impedit placeat doloribus officiis accusamus ipsa vero repellat, cupiditate reprehenderit laboriosam minus asperiores architecto illum ea adipisci sequi quo non earum?",
  postDescription:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo impedit placeat doloribus officiis accusamus ipsa vero repellat, cupiditate reprehenderit laboriosam minus asperiores architecto illum ea adipisci sequi quo non earum?",
  postOwner: {
    __v: 0,
    _id: "64b7f4f2f1c2a3b4c5d6e7f8",
    username: "naturelover",
    displayName: "Nature Lover",
    email: "naturelover@example.com",
    password: "hashedpassword",
    salt: "randomsalt",
    createdAt: "2024-07-18T12:34:56Z",
    updatedAt: "2024-07-18T12:34:56Z",
  } as User,
  photoCloudinaryId: "sunset123",
  photoUrl: "https://example.com/sunset.jpg",
  photoWidth: 1920,
  photoHeight: 1080,
  photoAspectRatio: 1.78,
  photoDescription: "lorem",
  photoBlurHash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
  descriptionEmbeddings: [0.1, 0.2, 0.3],
  _id: "64b7f4f2f1c2a3b4c5d6e7f8",
  __v: 0,
  createdAt: "2024-07-18T12:34:56Z",
  updatedAt: "2024-07-18T12:34:56Z",
};

const PAGE_SIZE = 30;

function Explore() {
  const exampleLoad = useCallback(
    async (page: number, limit = PAGE_SIZE): Promise<Array<typeof item>> => {
      await new Promise((r) => setTimeout(r, 250));
      return Array.from({ length: limit }).map((_, i) => {
        const idx = (page - 1) * limit + i;
        return {
          ...item,
          _id: String(idx),
          photoUrl: `https://dummyimage.com/${300 + (i % 4) * 100}x${500 + (i % 6) * 100}`,
        };
      });
    },
    []
  );

  const { Masonry } = useMasonryInfinite({
    fetcher: exampleLoad,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <Header />

      <Container component="section" style={{ paddingTop: headerHeight }}>
        <Heading variant="h1" className="mt-11">
          What&apos;s new on Pinterest
        </Heading>

        <Masonry
          maxColumnCount={5}
          columnGutter={16}
          rowGutter={16}
          render={({ data: item }) => (
            <div key={item._id} className="grid-item space-y-2 text-sm leading-[17px]">
              <img
                src={item.photoUrl}
                alt={item.postDescription}
                className="rounded-xl bg-[#1116]"
              />

              <div className="flex gap-x-1">
                <div className="space-y-2 *:line-clamp-2">
                  <p className="font-medium">{item.postTitle}</p>

                  <p>{item.postDescription}</p>
                </div>

                <Button size="icon-sm" variant="ghost">
                  <BsThreeDots />
                </Button>
              </div>
            </div>
          )}
        />
      </Container>
    </div>
  );
}

export default Explore;
