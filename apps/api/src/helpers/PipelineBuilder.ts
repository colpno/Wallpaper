import type { FilterQuery, PipelineStage, PopulateOptions, SortOrder } from "mongoose";

import type { EmbedOptions, QueryFilter, Select, Sort } from "@repo/types";

import buildMongoFilter from "./build-mongo-filter.js";

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
      paginationStages?: PipelineStage.Facet;
    };

export default class PipelineBuilder {
  private fieldToCollectionNameMap: Exclude<Options["fieldToCollectionNameMap"], undefined>;

  constructor(options?: Options) {
    this.fieldToCollectionNameMap = options?.fieldToCollectionNameMap ?? {};
  }

  public build<Data extends Record<string, unknown>, IsPipeline extends boolean = true>(
    query?: QueryFilter<Data>,
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
      stages.lookupStages = this.lookup(lookup as PopulateOptions);
    }

    if (sort) {
      stages.$sort = this.sort(sort).$sort;
    }

    if (project) {
      stages.$project = this.project(project).$project;
    }

    if (limit) {
      const pageNumber = page ?? 1;
      stages.paginationStages = {
        $facet: {
          meta: [
            { $count: "pageSize" },
            {
              $addFields: {
                page: pageNumber,
                perPage: limit,
              },
            },
            {
              $addFields: {
                totalPages: { $ceil: { $divide: ["$pageSize", "$perPage"] } },
              },
            },
          ],
          data: [this.skip(pageNumber, limit), { $limit: limit }],
        },
      };
    }

    if (options?.isPipeline) {
      const pipeline = [
        stages.$match ? { $match: stages.$match } : undefined,
        ...(stages.lookupStages ?? []),
        stages.$sort ? { $sort: stages.$sort } : undefined,
        stages.$project ? { $project: stages.$project } : undefined,
        ...(stages.paginationStages
          ? [
              stages.paginationStages,
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

  public count<T extends Record<string, unknown>>(input: QueryFilter<T>): PipelineStage[] {
    const pipelines = this.build(input);
    return [...pipelines, { $count: "total" }];
  }

  public project(input: Select<string>) {
    return { $project: input };
  }

  public skip(page: number, perPage: number) {
    return { $skip: (page - 1) * perPage };
  }

  public sort(input: Sort<string>) {
    const transformOrder = (arr: [string, SortOrder | undefined][]) => {
      return arr.map<[string, PipelineStage.Sort["$sort"][string]]>(([field, order]) => [
        field,
        order === "asc" ? 1 : -1,
      ]);
    };
    return {
      $sort: Object.fromEntries(
        transformOrder(Array.isArray(input) ? input : Object.entries(input))
      ),
    };
  }

  public match(filter: FilterQuery<Record<string, unknown>>): PipelineStage.Match {
    return { $match: buildMongoFilter(filter) as PipelineStage.Match["$match"] };
  }

  public lookup<Data extends Record<string, unknown>>(
    reference: PopulateOptions | (PopulateOptions | string)[]
  ): PipelineStage[] {
    const buildStages = (
      referenceInput: typeof reference,
      parentFieldPath: string = ""
    ): PipelineStage[] => {
      const referList = (
        typeof referenceInput === "string"
          ? [{ path: referenceInput }]
          : Array.isArray(referenceInput)
            ? referenceInput
            : [referenceInput]
      ) as EmbedOptions<Data>[];

      return referList.flatMap((refer) => {
        const path = refer.path as string;
        const localField = (parentFieldPath ? `${parentFieldPath}.${path}` : path) as string;
        const lookupPipeline: PipelineStage.Lookup["$lookup"]["pipeline"] = [];

        if (refer.match) lookupPipeline.push(this.match(refer.match));
        if (refer.options?.projection) lookupPipeline.push(this.project(refer.options.projection));

        const stages: PipelineStage[] = [
          {
            $set: {
              _isLocalFieldArray: { $isArray: `$${localField}` },
            },
          },
          {
            $lookup: {
              from: this.fieldToCollectionNameMap?.[path] ?? path,
              localField: localField,
              foreignField: "_id",
              pipeline: lookupPipeline,
              as: localField,
            },
          },
          {
            $set: {
              [`${localField}`]: {
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
                  then: { $gt: [{ $size: `$${localField}` }, 0] },
                  else: true,
                },
              },
            },
          });
        }

        if ("populate" in refer && refer.populate) {
          stages.push(...buildStages(refer.populate as typeof reference, localField));
        }

        return stages;
      });
    };

    return buildStages(reference);
  }
}
