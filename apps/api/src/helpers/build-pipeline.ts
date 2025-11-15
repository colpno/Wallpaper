import { Types } from "@repo/shared";
import { type PipelineStage } from "mongoose";

import parseQuery from "./parse-query";

type BuildLookupPipelineOptions = {
  fieldToCollectionMap?: Record<string, string>;
};

function buildLookup<T extends Record<string, unknown>>(
  reference: Types.Embed<T>,
  optionsArg?: BuildLookupPipelineOptions
): PipelineStage[] {
  const buildStages = (
    referenceInput: typeof reference,
    parentFieldPath: string = ""
  ): PipelineStage[] => {
    // Normalize reference input to an array of populate options
    const referList: Types.EmbedOptions<T>[] = (
      typeof referenceInput === "string"
        ? [{ path: referenceInput }]
        : Array.isArray(referenceInput)
          ? typeof referenceInput[0] === "string"
            ? (referenceInput as string[]).map((path) => ({ path }))
            : referenceInput
          : [referenceInput]
    ) as Types.EmbedOptions<T>[];

    return referList.flatMap((refer) => {
      const referPath = refer.path as string;
      const localField = parentFieldPath ? `${parentFieldPath}.${referPath}` : `${referPath}`;
      const foreignCollection = optionsArg?.fieldToCollectionMap?.[referPath] ?? referPath;

      const lookupPipeline: PipelineStage.Lookup["$lookup"]["pipeline"] = buildPipeline({
        ...refer.match,
        ...refer.options,
        select: refer.select as Types.ApiQuery<T>["select"],
      }).map(
        (stage) =>
          Object.fromEntries(
            Object.entries(stage).filter(([stageKey]) =>
              ["$merge", "$out"].every((key) => stageKey !== key)
            )
          ) as Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>
      );

      const stages: PipelineStage[] = [
        {
          $set: {
            [`_${localField}Type`]: { $type: `$${localField}` },
          },
        },
        {
          $lookup: {
            from: foreignCollection,
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
                if: { $eq: [`$_${localField}Type`, "array"] },
                then: `$${localField}`,
                else: { $first: `$${localField}` },
              },
            },
          },
        },
        {
          $unset: `_${localField}Type`,
        },
      ];

      if ("populate" in refer && refer.populate) {
        stages.push(...buildStages(refer.populate as Types.Embed<T>, localField));
      }

      return stages;
    });
  };

  return buildStages(reference);
}

/**
 * Executes a Mongoose query based on the provided filter.
 * @param model Mongoose model.
 * @param query A filter object.
 * @returns A promise that resolves to an array of documents matching the query.
 */
export default function buildPipeline<T extends Record<string, unknown>>(
  query: Types.ApiQuery<T>,
  options?: BuildLookupPipelineOptions
): PipelineStage[] {
  const { filter, embed, limit, select, skip, sort } = parseQuery(query);
  const pipeline: PipelineStage[] = [];

  if (Object.keys(filter).length > 0) pipeline.push({ $match: filter });

  if (embed) pipeline.push(...buildLookup(embed, options));

  if (sort)
    pipeline.push({
      $sort: Object.fromEntries(
        Object.entries(sort).map(([key, value]) => [
          key,
          value === "asc" ? 1 : value === "desc" ? -1 : value,
        ])
      ),
    });

  if (select) pipeline.push({ $project: select });

  if (skip !== undefined) pipeline.push({ $skip: skip });

  if (limit !== undefined) pipeline.push({ $limit: limit });

  return pipeline;
}
