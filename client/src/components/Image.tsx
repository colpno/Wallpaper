import { ImgHTMLAttributes, memo } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement>;

function Image({ loading = 'lazy', ...imgProps }: Props) {
  return <img {...imgProps} loading={loading} />;
}

export default memo(Image);
