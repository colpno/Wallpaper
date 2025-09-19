export type ReplaceTypeKeys<ToBeReplace, ToReplace> = Omit<ToBeReplace, keyof ToReplace> &
  ToReplace;

export type Theme = 'light' | 'dark' | 'system';
