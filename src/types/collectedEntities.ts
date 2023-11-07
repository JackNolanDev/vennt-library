import { z } from "zod";
import {
  entityValidator,
  abilityValidator,
  itemValidator,
  entityTextValidator,
  entityFluxValidator,
  fullEntityValidator,
  fullAbilityValidator,
  fullItemValidator,
  fullEntityTextValidator,
  fullEntityFluxValidator,
  attributeChangelogValidator,
  fullAttributeChangelogValidator,
} from ".";

export const collectedEntityValidator = z.object({
  entity: entityValidator,
  abilities: abilityValidator.array(),
  items: itemValidator.array(),
  text: entityTextValidator.array(),
  flux: entityFluxValidator.array(),
});

export const fullCollectedEntityValidator = z.object({
  entity: fullEntityValidator,
  abilities: fullAbilityValidator.array(),
  items: fullItemValidator.array(),
  text: fullEntityTextValidator.array(),
  flux: fullEntityFluxValidator.array(),
});

export const collectedEntityWithChangelogValidator =
  collectedEntityValidator.extend({
    changelog: attributeChangelogValidator.array(),
  });

export const fullCollectedEntityWithChangelogValidator =
  fullCollectedEntityValidator.extend({
    changelog: fullAttributeChangelogValidator.array(),
  });

export type UncompleteCollectedEntity = z.infer<
  typeof collectedEntityValidator
>;
export type FullCollectedEntity = z.infer<typeof fullCollectedEntityValidator>;
export type CollectedEntity = UncompleteCollectedEntity | FullCollectedEntity;
export type UncompleteCollectedEntityWithChangelog = z.infer<
  typeof collectedEntityWithChangelogValidator
>;
export type FullCollectedEntityWithChangelog = z.infer<
  typeof fullCollectedEntityWithChangelogValidator
>;
