import { solveEquation } from "..";
import {
  CriteriaFieldOperator,
  UseCriteriaBase,
  EntityAbility,
  ComputedAttributes,
  UseCriteriaCompFieldAbilityField,
  UseCriteriaCompField,
  UseCriteriaComp,
  UseCriteriaSpecial,
  UseCriteria,
} from "../..";

const criteriaFieldOperator = (
  operator: CriteriaFieldOperator
): ((field1: string, field2: string) => boolean) => {
  switch (operator) {
    case "equals":
      return (field1: string, field2: string) => field1 === field2;
    case "gte":
      return (field1: string, field2: string) =>
        parseInt(field1) >= parseInt(field2);
    case "gt":
      return (field1: string, field2: string) =>
        parseInt(field1) > parseInt(field2);
    case "lte":
      return (field1: string, field2: string) =>
        parseInt(field1) <= parseInt(field2);
    case "lt":
      return (field1: string, field2: string) =>
        parseInt(field1) < parseInt(field2);
    default:
      return () => false;
  }
};

const abilityPassCriteriaCheckBase = (
  criteria: UseCriteriaBase,
  usesAbility: EntityAbility,
  checkAbility: EntityAbility | null,
  attrs: ComputedAttributes
): boolean => {
  if (criteria.operator === "every") {
    return criteria.tests.every((test) =>
      abilityPassCriteriaCheck(test, usesAbility, checkAbility, attrs)
    );
  } else if (criteria.operator === "some") {
    return criteria.tests.some((test) =>
      abilityPassCriteriaCheck(test, usesAbility, checkAbility, attrs)
    );
  }
  return false;
};

const abilityCompFieldAbilityField = (
  field: UseCriteriaCompFieldAbilityField,
  checkAbility: EntityAbility | null
): string | boolean => {
  if (!checkAbility) {
    return true;
  }
  // walk down checkAbility to find field referenced by the path
  let searchField: any = checkAbility;
  for (const key of field.path) {
    if (typeof field !== "object" || !field) {
      break;
    }
    searchField = searchField[key];
  }
  if (typeof searchField === "string") {
    return searchField;
  } else if (typeof searchField === "number") {
    return searchField.toString();
  }
  return false;
};

const abilityCompField = (
  field: UseCriteriaCompField,
  usesAbility: EntityAbility,
  checkAbility: EntityAbility | null,
  attrs: ComputedAttributes
): string | boolean => {
  switch (field.type) {
    case "ability_field":
      return abilityCompFieldAbilityField(field, checkAbility);
    case "attr":
      return attrs[field.attr]?.val.toString() ?? false;
    case "const":
      return field.const;
    case "equation":
      return solveEquation(field.equation, attrs)?.toString() ?? false;
    case "key":
      return (usesAbility.custom_fields?.keys ?? {})[field.key] ?? false;
    default:
      return false;
  }
};

const abilityPassCriteriaCheckComp = (
  criteria: UseCriteriaComp,
  usesAbility: EntityAbility,
  checkAbility: EntityAbility | null,
  attrs: ComputedAttributes
): boolean => {
  const left = abilityCompField(
    criteria.left,
    usesAbility,
    checkAbility,
    attrs
  );
  if (typeof left === "boolean") {
    return left;
  }
  const right = abilityCompField(
    criteria.right,
    usesAbility,
    checkAbility,
    attrs
  );
  if (typeof right === "boolean") {
    return right;
  }
  // console.log(criteria, left, right);
  const comparator = criteriaFieldOperator(criteria.operator);
  return comparator(left, right);
};

const abilityPassCriteriaIsSpell = (ability: EntityAbility): boolean => {
  const basicSpell =
    ability.custom_fields?.cast_dl || ability.custom_fields?.mp_cost;
  if (basicSpell) {
    return true;
  }
  const path = ability.custom_fields?.path;
  if (path) {
    const magicPath = ["Arcana", "Spellcaster", "Magician", "Wizard"].some(
      (test) => path.includes(test)
    );
    return Boolean(magicPath && ability.custom_fields?.cost?.mp);
  }
  return false;
};

const abilityPassCriteriaCheckSpecial = (
  criteria: UseCriteriaSpecial,
  checkAbility: EntityAbility | null
): boolean => {
  if (!checkAbility) {
    return true;
  }
  switch (criteria.name) {
    case "isSpell":
      return abilityPassCriteriaIsSpell(checkAbility);
    default:
      return false;
  }
};

export const abilityPassCriteriaCheck = (
  criteria: UseCriteria,
  usesAbility: EntityAbility,
  checkAbility: EntityAbility | null,
  attrs: ComputedAttributes
): boolean => {
  switch (criteria.type) {
    case "base":
      return abilityPassCriteriaCheckBase(
        criteria,
        usesAbility,
        checkAbility,
        attrs
      );
    case "comp":
      return abilityPassCriteriaCheckComp(
        criteria,
        usesAbility,
        checkAbility,
        attrs
      );
    case "special":
      return abilityPassCriteriaCheckSpecial(criteria, checkAbility);
    default:
      return false;
  }
};
