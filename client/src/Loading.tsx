import { useDisableScroll } from '~/hooks/index.ts';
import { Image } from './components/index.ts';

function Loading() {
  useDisableScroll();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-primary-1 z-loading">
      <Image src="/cat-eating-cake.gif" alt="Loading..." />
    </div>
  );
}

export default Loading;
