import { EntityAttribute } from ".";

export const NAME_MAX = 100;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 2_000;
export const ABILITY_MAX = 7_000;
export const ABILITY_PREREQ_MAX = 200;
export const ITEM_MAX = 2_000;
export const COMMENT_MAX = 2_000;
export const CHANGELOG_MAX = 200;
export const ATTRIBUTE_MIN = -15;
export const ATTRIBUTE_MAX = 15;
export const ENTITY_TEXT_MAX = 10_000;
export const ENTITY_FLUX_MAX = 500;
export const ATTRIBUTES = [
  "per",
  "tek",
  "agi",
  "dex",
  "int",
  "spi",
  "str",
  "wis",
  "cha",
] as const;
export const CHARACTER_GIFTS = [
  "Alertness",
  "Craft",
  "Alacrity",
  "Finesse",
  "Mind",
  "Magic",
  "Rage",
  "Science",
  "Charm",
  "None",
] as const;
export const ATTRIBUTES_SET = new Set<EntityAttribute>(ATTRIBUTES);
