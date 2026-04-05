import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<typeof ResponsiveMasonry>;

function MasonryLayout({ children, ...props }: Props) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 0: 2, 700: 3, 900: 4, 1080: 5 }}
      gutterBreakPoints={{ 0: "16px" }}
      {...props}
    >
      <Masonry>{children}</Masonry>
    </ResponsiveMasonry>
  );
}

export default MasonryLayout;
