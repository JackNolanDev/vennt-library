import { solveEquation } from "..";
import { ComputedAttributes, EntityAbility } from "../..";

export const abilityExtendEntityAttributes = (
  ability: EntityAbility,
  attrs: ComputedAttributes
): ComputedAttributes => {
  const keyStorage = ability.custom_fields?.keys;
  if (!keyStorage) {
    return attrs;
  }

  return Object.entries(keyStorage).reduce<ComputedAttributes>(
    (acc, [key, val]) => {
      const parsed = solveEquation(val, acc);
      if (parsed) {
        acc[key] = { val: parsed };
      }
      return acc;
    },
    { ...attrs }
  );
};
