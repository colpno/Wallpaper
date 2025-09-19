import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classNames: ClassValue[]) => {
  return twMerge(clsx(...classNames));
};

type ZIndexLayerName = string;
type ZIndexMap = Record<ZIndexLayerName, number>;

const createZIndexes = (layers: ZIndexLayerName[]): ZIndexMap => {
  const INDEX_GAP = 10;

  return layers.reduce((acc, layerName, index) => {
    acc[layerName] = ++index * INDEX_GAP;
    return acc;
  }, {} as ZIndexMap);
};

/** First is smallest, last is largest. */
const Z_INDEX_LAYERS: ZIndexLayerName[] = ['backdrop', 'popover', 'header', 'loading'];

export const zIndexes = createZIndexes(Z_INDEX_LAYERS);
