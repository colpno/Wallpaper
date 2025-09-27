export type Environment = "production" | "development" | "test";
export type QueryFilterOperators =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "all"
  | "in"
  | "nin"
  | "regex"
  | "options"
  | "size"
  | "exists"
  | "and"
  | "or"
  | "nor"
  | "not";
