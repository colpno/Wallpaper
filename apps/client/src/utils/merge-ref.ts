import type { RefObject } from "react";

export const mergeRefs = <T>(...refs: Array<React.Ref<T>>) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as RefObject<T>).current = value;
      }
    });
  };
};
