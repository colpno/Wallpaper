import BaseMasonry, { ResponsiveMasonry } from "react-responsive-masonry";

function Masonry({ children, ...props }: React.ComponentProps<typeof ResponsiveMasonry>) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 0: 2, 700: 3, 900: 4, 1080: 5 }}
      gutterBreakPoints={{ 0: "16px" }}
      {...props}
    >
      <BaseMasonry>{children}</BaseMasonry>
    </ResponsiveMasonry>
  );
}

export default Masonry;
