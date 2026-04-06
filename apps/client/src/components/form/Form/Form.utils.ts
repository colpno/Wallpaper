/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DeepPartial, FieldValues, FormState } from "react-hook-form";

/**
 *  Utility function to get dirty values from form fields.
 *  It checks if the fields are dirty based on the provided dirtyFields map.
 *  If a field is dirty, it returns the corresponding value from allFields.
 *  If a field is not dirty, it is not included in the result.
 * @param allFields An object containing all form fields and their values.
 * @param dirtyFields An object containing all form fields and their boolean dirty state.
 * @returns An object containing only the fields that are dirty, with their corresponding values from allFields.
 */
export const extractDirtyValues = <T extends FieldValues>(
  values: T,
  dirty: FormState<T>["dirtyFields"]
): DeepPartial<T> | undefined => {
  if ((dirty as any) === true) return values as any;
  if ((dirty as any) === false) return undefined;

  if (Array.isArray(values)) {
    const arr = values
      .map((v, i) => extractDirtyValues(v, (dirty as any)[i]))
      .filter((v) => v !== undefined);

    return arr.length ? (arr as any) : undefined;
  }

  const obj = {} as DeepPartial<T>;

  for (const k in dirty) {
    const v = extractDirtyValues(values[k], dirty[k] as any);
    if (v !== undefined) obj[k] = v;
  }

  return Object.keys(obj).length ? obj : undefined;
};
