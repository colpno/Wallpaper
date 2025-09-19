import { memo } from 'react';

import { Image as ImageType } from '~/types/index.ts';
import { SearchableImage } from './index.ts';

interface Props {
  columnCount?: number;
  gap?: number;
  images: ImageType[];
}

function Gallery({ images, columnCount, gap }: Props) {
  const spacing = gap ? gap / 2 : 0;

  return (
    <div
      className="gap-x-0"
      style={{ columns: columnCount, marginTop: -spacing, marginBottom: -spacing }}
    >
      {images.map((image) => (
        <SearchableImage
          key={image.id}
          src={image.src}
          alt={image.description}
          style={{ padding: `0 ${spacing}px`, margin: `${spacing}px 0` }}
          className="block w-full cursor-pointer rounded-3xl"
        />
      ))}
    </div>
  );
}

export default memo(Gallery);
