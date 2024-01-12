import { z } from "zod";
import {
  NAME_MAX,
  ABILITY_MAX,
  ABILITY_PREREQ_MAX,
  highlightValidator,
  nameValidator,
  usesValidator,
  COMMENT_MAX,
  idValidator,
  optionalComputedAttributesResponseValidator,
} from ".";

export const abilityCostNumberValidator = z.object({
  mp: z.number().int().optional(),
  vim: z.number().int().optional(),
  hp: z.number().int().optional(),
  hero: z.number().int().optional(),
  actions: z.number().int().optional(),
  reactions: z.number().int().optional(),
});
export type AbilityCostMapNumber = z.infer<typeof abilityCostNumberValidator>;

export const numericAbilityCostKeys = Object.keys(
  abilityCostNumberValidator.keyof().Values
) as Array<keyof AbilityCostMapNumber>;

export const abilityCostBooleanValidator = z.object({
  attack: z.boolean().optional(),
  passive: z.boolean().optional(),
  respite: z.boolean().optional(),
  rest: z.boolean().optional(),
  intermission: z.boolean().optional(),
});
export type AbilityCostMapBoolean = z.infer<typeof abilityCostBooleanValidator>;

export const booleanAbilityCostKeys = Object.keys(
  abilityCostBooleanValidator.keyof().Values
) as Array<keyof AbilityCostMapBoolean>;

export const abilityCostValidator = abilityCostNumberValidator.merge(
  abilityCostBooleanValidator
);

export const abilityFieldsValidatorStrings = z.object({
  activation: z.string().max(NAME_MAX).optional(),
  expedited: z.string().max(NAME_MAX).optional(),
  flavor: z.string().max(ABILITY_MAX).optional(),
  path: z.string().max(NAME_MAX).optional(),
  purchase: z.string().max(NAME_MAX).optional(),
  unlocks: z.string().max(NAME_MAX).optional(),
  partial_unlocks: z.string().max(NAME_MAX).optional(),
  prereq: z.string().max(ABILITY_PREREQ_MAX).optional(),
  build_dc: z.string().max(NAME_MAX).optional(),
  build_time: z.string().max(NAME_MAX).optional(),
  range: z.string().max(NAME_MAX).optional(),
});

export const abilityFieldsValidator = abilityFieldsValidatorStrings.extend({
  cost: abilityCostValidator.optional(),
  spell_cost: abilityCostValidator.array().length(3).optional(),
  spell_maintenance_cost: abilityCostValidator.optional(),
  mp_cost: z.number().int().array().length(3).optional(),
  cast_dl: z.number().int().array().length(3).optional(),
  not_req: z.boolean().optional(),
  repeatable: z.boolean().optional(),
  times_taken: z.number().int().min(0).optional(),
  keys: z.record(z.string().min(1), z.string().min(1)).optional(),
  stars: z.number().int().optional(),
  highlight: highlightValidator.optional(),
});

export const abilityFieldsNameValidator = abilityFieldsValidator.keyof();

export const abilityValidator = z.object({
  name: nameValidator,
  effect: z.string().min(1).max(ABILITY_MAX),
  custom_fields: abilityFieldsValidator.optional().nullable(),
  uses: usesValidator.optional().nullable().catch(null), // if something in uses is invalid, default to null.
  comment: z.string().max(COMMENT_MAX).optional().nullable(),
  active: z.boolean(),
});

export const partialAbilityValidator = abilityValidator
  .partial()
  .refine((ability) => Object.keys(ability).length > 0, {
    message: "Partial ability is empty",
  });

export const fullAbilityValidator = abilityValidator.extend({
  id: idValidator,
  entity_id: idValidator,
});

export type UncompleteEntityAbility = z.infer<typeof abilityValidator>;
export type FullEntityAbility = z.infer<typeof fullAbilityValidator>;
export type EntityAbility = UncompleteEntityAbility | FullEntityAbility;
export type PartialEntityAbility = z.infer<typeof partialAbilityValidator>;
export type AbilityCostMap = z.infer<typeof abilityCostValidator>;
export type EntityAbilityFieldsStrings = z.infer<
  typeof abilityFieldsValidatorStrings
>;
export type EntityAbilityFields = z.infer<typeof abilityFieldsNameValidator>;

export const postAbilitiesResponseValidator =
  optionalComputedAttributesResponseValidator.extend({
    abilities: fullAbilityValidator.array(),
  });
export const patchAbilityResponseValidator =
  optionalComputedAttributesResponseValidator.extend({
    ability: fullAbilityValidator,
  });
export type PostAbilitiesResponse = z.infer<
  typeof postAbilitiesResponseValidator
>;
export type PatchAbilityResponse = z.infer<
  typeof patchAbilityResponseValidator
>;
