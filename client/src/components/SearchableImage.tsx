import { memo } from 'react';
import { LuScanSearch } from 'react-icons/lu';

import { ROUTE_VISUAL_SEARCH } from '~/constants/routeConstants.ts';
import Image from './Image.tsx';
import { Button } from './index.ts';

type Props = React.ComponentProps<typeof Image>;

function SearchableImage(props: Props) {
  return (
    <div className="relative overflow-clip">
      <Image className="block w-full max-h-dvh" {...props} />
      <Button
        as="icon"
        href={ROUTE_VISUAL_SEARCH}
        className="!absolute bottom-3 right-3 !bg-gray-300 size-10 *:text-black"
      >
        <LuScanSearch />
      </Button>
    </div>
  );
}

export default memo(SearchableImage);
