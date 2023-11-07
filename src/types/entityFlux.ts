import { z } from "zod";
import { ENTITY_FLUX_MAX, idValidator } from ".";

export const fluxTypeValidator = z.enum([
  "QUEST",
  "TIDE",
  "GRATE",
  "DAM",
  "EFFLUENT",
  "DELTA",
]);

export const fluxMetadataValidator = z.object({
  effect: z.string().max(ENTITY_FLUX_MAX).optional(),
});

export const entityFluxValidator = z.object({
  type: fluxTypeValidator,
  text: z.string().max(ENTITY_FLUX_MAX),
  metadata: fluxMetadataValidator.optional().nullable(),
});

export const fullEntityFluxValidator = entityFluxValidator.extend({
  id: idValidator,
  entity_id: idValidator,
});

export const partialEntityFluxValidator = entityFluxValidator
  .partial()
  .refine((ability) => Object.keys(ability).length > 0, {
    message: "Partial flux is empty",
  });

export type EntityFluxType = z.infer<typeof fluxTypeValidator>;
export type UncompleteEntityFlux = z.infer<typeof entityFluxValidator>;
export type FullEntityFlux = z.infer<typeof fullEntityFluxValidator>;
export type PartialEntityFlux = z.infer<typeof partialEntityFluxValidator>;
