import { useEffect } from "react";

export const useObjectURL = <T extends File | null>(file: T) => {
  const src = (file ? URL.createObjectURL(file) : null) as T extends null ? null : string;

  useEffect(() => {
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [src]);

  return src;
};
