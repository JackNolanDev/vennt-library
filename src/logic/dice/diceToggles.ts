import {
  abilityExtendEntityAttributes,
  abilityPassCriteriaCheck,
  replaceVariablesInEquation,
} from "..";
import {
  CollectedEntity,
  ComputedAttributes,
  DiceToggles,
  UsesCheck,
  DiceSettings,
  DiceToggle,
  FullEntityAbility,
  FullEntityItem,
} from "../..";

export const diceTogglesForEntity = (
  entity: CollectedEntity,
  attrs: ComputedAttributes
): DiceToggles => {
  const toggles: DiceToggles = {};

  const saveSettingToToggle = (
    key: string,
    check: UsesCheck | undefined,
    src: { ability_id?: string; item_id?: string },
    overrideAttrs?: ComputedAttributes
  ): void => {
    if (!check) {
      return;
    }
    const setting: DiceSettings = check.dice_settings ?? {
      end: check.bonus,
    };
    if (setting.end) {
      setting.end = replaceVariablesInEquation(
        setting.end,
        overrideAttrs ?? attrs
      ).cleanedEquation;
    }
    const toggle: DiceToggle = {
      setting,
      attr: check.attr,
      ...(check.label && { label: check.label }),
      ...((src?.ability_id || src?.item_id) && { src }),
    };
    toggles[key] = toggle;
  };

  entity.abilities.forEach((ability) => {
    const extendedAttrs = abilityExtendEntityAttributes(ability, attrs);
    const checks =
      ability.uses?.criteria_benefits
        ?.filter(
          (criteria) =>
            criteria.check &&
            abilityPassCriteriaCheck(
              criteria.criteria,
              ability,
              null,
              extendedAttrs
            )
        )
        .map((criteria) => criteria.check) ?? [];
    checks.push(ability.uses?.check);
    checks.forEach((check) => {
      saveSettingToToggle(
        ability.name,
        check,
        { ability_id: (ability as FullEntityAbility).id },
        extendedAttrs
      );
    });
  });

  entity.items
    .filter(
      (item) =>
        (item.active || item.type === "equipment") &&
        !item.custom_fields?.in_storage
    )
    .forEach((item) => {
      saveSettingToToggle(item.name, item.uses?.check, {
        item_id: (item as FullEntityItem).id,
      });
    });

  return toggles;
};
