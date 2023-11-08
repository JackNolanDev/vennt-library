import { abilityPassCriteriaCheck } from "..";
import {
  CollectedEntity,
  ComputedAttributes,
  DiceToggles,
  UsesCheck,
  DiceSettings,
  DiceToggle,
} from "../..";

export const diceTogglesForEntity = (
  entity: CollectedEntity,
  attrs: ComputedAttributes
): DiceToggles => {
  const toggles: DiceToggles = {};

  const saveSettingToToggle = (key: string, check?: UsesCheck): void => {
    if (!check) {
      return;
    }
    const setting: DiceSettings = check.dice_settings ?? {
      end: check.bonus,
    };
    const toggle: DiceToggle = {
      setting,
      attr: check.attr,
      label: check.label,
    };
    toggles[key] = toggle;
  };

  entity.abilities.forEach((ability) => {
    const checks =
      ability.uses?.criteria_benefits
        ?.filter(
          (criteria) =>
            criteria.check &&
            abilityPassCriteriaCheck(criteria.criteria, ability, null, attrs)
        )
        .map((criteria) => criteria.check) ?? [];
    checks.push(ability.uses?.check);
    checks.forEach((check) => {
      saveSettingToToggle(ability.name, check);
    });
  });

  entity.items
    .filter(
      (item) =>
        (item.active || item.type === "equipment") &&
        !item.custom_fields?.in_storage
    )
    .forEach((item) => {
      saveSettingToToggle(item.name, item.uses?.check);
    });

  return toggles;
};
