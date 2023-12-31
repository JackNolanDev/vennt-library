import { z } from "zod";
import {
  NAME_MAX,
  attributeNameValidator,
  equationValidator,
  diceSettingsValidator,
  itemFieldsValidator,
} from ".";

export const weaponFieldsWithOptionalLabel = itemFieldsValidator.extend({
  label: z.string().max(NAME_MAX).optional(),
});

export const useAttrMapValidator = z.record(
  attributeNameValidator,
  equationValidator
);
export type UseAttrMap = z.infer<typeof useAttrMapValidator>;

export const useRollValidator = z.object({
  dice: z.string().max(NAME_MAX),
  attr: attributeNameValidator,
  heal: useAttrMapValidator.optional(),
});
export const useHealValidator = z.object({
  attr: useAttrMapValidator,
});
export const useOptionalHealValidator = useHealValidator.extend({
  label: z.string().min(1).max(NAME_MAX).optional(),
});
export const useAdjustValidator = z.object({
  time: z.enum(["turn", "encounter", "rest", "permanent"]),
  attr: useAttrMapValidator.optional(),
  dice: z.record(attributeNameValidator, diceSettingsValidator).optional(),
  order: z.number().int().optional(),
});
export const criteriaFieldOperator = z.enum([
  "equals",
  "gte",
  "gt",
  "lte",
  "lt",
]);
export type CriteriaFieldOperator = z.infer<typeof criteriaFieldOperator>;
export const useCriteriaCompFieldAttrValidator = z.object({
  type: z.literal("attr"),
  attr: attributeNameValidator,
});
export type UseCriteriaCompFieldAttr = z.infer<
  typeof useCriteriaCompFieldAttrValidator
>;
export const useCriteriaCompFieldAbilityValidator = z.object({
  type: z.literal("ability_field"),
  path: z.string().min(1).array(),
});
export type UseCriteriaCompFieldAbilityField = z.infer<
  typeof useCriteriaCompFieldAbilityValidator
>;
export const useCriteriaCompFieldKeyValidator = z.object({
  type: z.literal("key"),
  key: z.string().min(1),
});
export type UseCriteriaCompFieldKey = z.infer<
  typeof useCriteriaCompFieldKeyValidator
>;
export const useCriteriaCompFieldConstValidator = z.object({
  type: z.literal("const"),
  const: z.string().min(1),
});
export type UseCriteriaCompFieldCost = z.infer<
  typeof useCriteriaCompFieldConstValidator
>;
export const useCriteriaCompFieldEquationValidator = z.object({
  type: z.literal("equation"),
  equation: z.string().min(1),
});
export type UseCriteriaCompFieldEquation = z.infer<
  typeof useCriteriaCompFieldEquationValidator
>;
export const useCriteriaCompFieldValidator = z.union([
  useCriteriaCompFieldAttrValidator,
  useCriteriaCompFieldAbilityValidator,
  useCriteriaCompFieldKeyValidator,
  useCriteriaCompFieldConstValidator,
  useCriteriaCompFieldEquationValidator,
]);
export type UseCriteriaCompField = z.infer<
  typeof useCriteriaCompFieldValidator
>;
export const useCriteriaCompValidator = z.object({
  type: z.literal("comp"),
  left: useCriteriaCompFieldValidator,
  right: useCriteriaCompFieldValidator,
  operator: criteriaFieldOperator,
});
export type UseCriteriaComp = z.infer<typeof useCriteriaCompValidator>;
export const useCriteriaSpecialValidator = z.object({
  type: z.literal("special"),
  name: z.enum(["isSpell"]),
});
export type UseCriteriaSpecial = z.infer<typeof useCriteriaSpecialValidator>;
export const useCriteriaBaseValidatorBase = z.object({
  type: z.literal("base"),
  operator: z.enum(["every", "some"]),
});
export type UseCriteriaBase = z.infer<typeof useCriteriaBaseValidatorBase> & {
  tests: Array<z.infer<typeof useCriteriaValidator>>;
};
export const useCriteriaBaseValidator: z.ZodType<UseCriteriaBase> =
  useCriteriaBaseValidatorBase.extend({
    tests: z.array(z.lazy(() => useCriteriaValidator)),
  });
export const useCriteriaValidator = z.union([
  useCriteriaCompValidator,
  useCriteriaSpecialValidator,
  useCriteriaBaseValidator,
]);
export type UseCriteria = z.infer<typeof useCriteriaValidator>;
export const useAdjustAbilityCostValidator = z.object({
  adjust_cost: equationValidator,
});
export const useCheckValidator = z.object({
  bonus: z.string().min(1).max(NAME_MAX).optional(),
  attr: attributeNameValidator,
  dice_settings: diceSettingsValidator.optional(),
  label: z.string().min(1).max(NAME_MAX).optional(),
});
export const useExposeCombatStats = attributeNameValidator.array();
export const useCriteriaBenefit = z.object({
  criteria: useCriteriaValidator,
  adjust: useAdjustValidator.optional(),
  adjust_ability_cost: useAdjustAbilityCostValidator.optional(),
  check: useCheckValidator.optional(),
});
export const useCriteriaBenefitResults = useCriteriaBenefit.array();
export const useInputBase = z.object({
  key: z.string().min(1).max(NAME_MAX),
  label: z.string().min(1).max(NAME_MAX).optional(),
});
export const useRadioInputBase = useInputBase.extend({
  type: z.literal("radio"),
});
export type UseRadioInput = z.infer<typeof useRadioInputBase> & {
  choices: Record<string, UseInputs | null>;
};
export const useRadioInput: z.ZodType<UseRadioInput> = useRadioInputBase.extend(
  {
    choices: z.record(
      z.string().min(1),
      z.lazy(() => useInputs.nullable())
    ),
  }
);
export const useTextInput = useInputBase.extend({
  type: z.literal("text"),
});
export type UseTextInput = z.infer<typeof useTextInput>;
export const useNumberInput = useInputBase.extend({
  type: z.literal("number"),
  min: equationValidator.optional(),
  max: equationValidator.optional(),
  default: equationValidator.optional(),
});
export type UseNumberInput = z.infer<typeof useNumberInput>;
export const useInput = z.union([useRadioInput, useTextInput, useNumberInput]);
export const useInputs = useInput.array();
export type UseInputs = z.infer<typeof useInputs>;
export const usesValidator = z.object({
  roll: useRollValidator.optional(),
  heal: useHealValidator.optional(),
  optional_heal: useOptionalHealValidator.array().optional(),
  adjust: useAdjustValidator.optional(),
  adjust_ability_cost: useAdjustAbilityCostValidator.optional(),
  check: useCheckValidator.optional(),
  expose_combat_stats: useExposeCombatStats.optional(),
  inputs: useInputs.optional(),
  criteria_benefits: useCriteriaBenefitResults.optional(),
  weapons: weaponFieldsWithOptionalLabel.array().optional(),
  hide_default_use_button: z.boolean().optional(),
});

export type UsesMap = z.infer<typeof usesValidator>;
export type UsesRoll = z.infer<typeof useRollValidator>;
export type UsesHeal = z.infer<typeof useHealValidator>;
export type UsesAdjust = z.infer<typeof useAdjustValidator>;
export type UsesCheck = z.infer<typeof useCheckValidator>;
