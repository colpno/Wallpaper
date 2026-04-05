import type { FilterQuery, PipelineStage, SortOrder } from "mongoose";

import type { EmbedOptions, KnownKeys, QueryFilter, Select, Sort } from "@repo/types";

type Options = {
  /**
   * Mapping of field to collection name
   * @example { movie_id: 'movies' }
   */
  fieldToCollectionNameMap?: Record<string, string>;
};

type BuildPipelineOptions<P extends boolean> = {
  isPipeline?: P;
};

type BuildPipelineReturnType<P extends boolean> = P extends true
  ? PipelineStage[]
  : Partial<PipelineStage.Match & PipelineStage.Sort & PipelineStage.Project> & {
      lookupStages?: PipelineStage[];
      paginationStages?: PipelineStage[];
    };

export default class PipelineBuilder {
  private fieldToCollectionNameMap: NonNullable<Options["fieldToCollectionNameMap"]>;

  constructor(options?: Options) {
    this.fieldToCollectionNameMap = options?.fieldToCollectionNameMap ?? {};
  }

  public build<Data extends Record<string, unknown>, IsPipeline extends boolean = true>(
    query?: Pick<QueryFilter<Data>, "embed" | "limit" | "page" | "select" | "sort"> &
      KnownKeys<FilterQuery<Data>>,
    options: BuildPipelineOptions<IsPipeline> = { isPipeline: true as IsPipeline }
  ): BuildPipelineReturnType<IsPipeline> {
    const {
      embed: lookup,
      sort: sort,
      select: project,
      limit: limit,
      page: page,
      ...filters
    } = query ?? {};

    const stages: BuildPipelineReturnType<false> = {};

    if (Object.keys(filters).length > 0) {
      stages.$match = this.match(filters).$match;
    }

    if (lookup) {
      stages.lookupStages = this.lookup(lookup);
    }

    if (sort) {
      stages.$sort = this.sort(sort).$sort;
    }

    if (project) {
      stages.$project = this.project(project).$project;
    }

    if (limit) {
      const pageNumber = page ?? 1;
      stages.paginationStages = [this.skip(pageNumber, limit), this.limit(limit)];
    }

    if (options?.isPipeline) {
      const pipeline = [
        stages.$match ? { $match: stages.$match } : undefined,
        ...(stages.lookupStages ?? []),
        stages.$sort ? { $sort: stages.$sort } : undefined,
        stages.$project ? { $project: stages.$project } : undefined,
        ...(stages.paginationStages
          ? [
              ...stages.paginationStages,
              {
                $unwind: "$meta",
              },
            ]
          : [undefined]),
      ].filter(Boolean);
      return pipeline as BuildPipelineReturnType<IsPipeline>;
    }

    return stages as BuildPipelineReturnType<IsPipeline>;
  }

  public project<T extends string>(input: Select<T>): PipelineStage.Project {
    const isExclusion = (val: string) => val.startsWith("-");

    if (typeof input === "string") {
      const key = input.replace(/^-/, "");
      const value = isExclusion(input) ? 0 : 1;
      return { $project: { [key]: value } };
    }

    return { $project: input };
  }

  public skip(page: number, perPage: number): PipelineStage.Skip {
    return { $skip: (page - 1) * perPage };
  }

  public limit(value: number): PipelineStage.Limit {
    return { $limit: value };
  }

  public sort<T extends string>(input: Sort<T>): PipelineStage.Sort {
    const ascOrders: Extract<SortOrder, 1 | "asc" | "ascending">[] = [1, "asc", "ascending"];

    const normalizeOrder = (arr: [string, SortOrder][]) => {
      return arr.map<[string, PipelineStage.Sort["$sort"][string]]>(([field, order]) => [
        field,
        ascOrders.some((ascOrder) => order === ascOrder) ? 1 : -1,
      ]);
    };

    return {
      $sort: Object.fromEntries(
        normalizeOrder(Array.isArray(input) ? input : Object.entries(input))
      ),
    };
  }

  public match<T extends Record<string, unknown>>(filter: FilterQuery<T>): PipelineStage.Match {
    return { $match: filter };
  }

  public lookup<T extends Record<string, unknown>>(
    reference: NonNullable<QueryFilter<T>["embed"]>,
    prefixFieldName: string = ""
  ): PipelineStage[] {
    // Normalize all types of values into an array of EmbedOptions
    const referList = (
      typeof reference === "string"
        ? [{ path: reference }]
        : Array.isArray(reference)
          ? reference
          : [reference]
    ) as EmbedOptions<T>[];

    return referList.flatMap((refer) => {
      const path = refer.path as string;
      const localField = prefixFieldName ? `${prefixFieldName}.${path}` : path;
      const pipeline: PipelineStage.Lookup["$lookup"]["pipeline"] = [];

      if (refer.match) pipeline.push(this.match(refer.match));
      if (refer.options?.projection) pipeline.push(this.project(refer.options.projection));

      // Besides $lookup operator, adding stages that unwrap an array of populated results,
      // as MongoDB always packs results in an array regardless of a single or multiple population
      const stages: PipelineStage[] = [
        {
          $set: {
            _isLocalFieldArray: { $isArray: `$${localField}` },
          },
        },
        {
          $lookup: {
            from: this.fieldToCollectionNameMap?.[path] ?? path,
            localField,
            foreignField: "_id",
            pipeline,
            as: localField,
          },
        },
        {
          $set: {
            [localField]: {
              $cond: {
                if: { $eq: ["$_isLocalFieldArray", true] },
                then: `$${localField}`,
                else: { $first: `$${localField}` },
              },
            },
          },
        },
        {
          $unset: "_isLocalFieldArray",
        },
      ];

      if (refer.match) {
        stages.push({
          $match: {
            $expr: {
              $cond: {
                if: { $isArray: `$${localField}` },
                // Return documents where localField is an array and has at least 1 item
                then: { $gt: [{ $size: `$${localField}` }, 0] },
                // Return documents where localField exists and is not an array
                else: { $ne: [{ $ifNull: [`$${localField}`, null] }, null] },
              },
            },
          },
        });
      }

      // Nested population
      if ("populate" in refer && refer.populate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stages.push(...this.lookup(refer.populate as any, localField));
      }

      return stages;
    });
  }
}
