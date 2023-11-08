import type { EntityAttribute, Equation } from "../types";

export const LEVEL_UPS_TO_INCREASE_ATTR = 2;

export const DEFAULT_ATTRS_MAP: Record<EntityAttribute, number> = {
  free_hands: 2,
  heroic_creativity_bonus: 3,
  actions_on_turn: 3,
  reactions_on_turn: 1,
};

interface AttrAdjustment {
  attr: EntityAttribute;
  eq: Equation;
}

// Apply to all entities
export const DEFAULT_ADJUSTMENTS: AttrAdjustment[] = [
  { attr: "agi", eq: "agi - agi_dmg" },
  { attr: "cha", eq: "cha - cha_dmg" },
  { attr: "dex", eq: "dex - dex_dmg" },
  { attr: "int", eq: "int - int_dmg" },
  { attr: "per", eq: "per - per_dmg" },
  { attr: "spi", eq: "spi - spi_dmg" },
  { attr: "str", eq: "str - str_dmg" },
  { attr: "tek", eq: "tek - tek_dmg" },
  { attr: "wis", eq: "wis - wis_dmg" },
];

// Apply to just characters
export const DEFAULT_CHARACTER_ADJUSTMENTS: AttrAdjustment[] = [
  { attr: "max_hp", eq: "max_hp + 20 + (xp / 1000) + (3 * str)" },
  { attr: "max_vim", eq: "max_vim + 20 + (xp / 1000) + (str * agi)" },
  { attr: "max_mp", eq: "max_mp + 6 + (3 * wis)" },
  { attr: "max_alerts", eq: "max_alerts + agi + per" },
  { attr: "init", eq: "init + agi + dex" },
  { attr: "speed", eq: "speed + 3 + agi - burden" },
];
