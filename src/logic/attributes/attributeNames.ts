import { EntityAttribute, ATTRIBUTES_SET, titleText } from "../..";

export const ATTRIBUTE_DAMAGES = [
  "agi_dmg",
  "cha_dmg",
  "dex_dmg",
  "int_dmg",
  "per_dmg",
  "spi_dmg",
  "str_dmg",
  "tek_dmg",
  "wis_dmg",
];

export const MIN_ZEROS = new Set([
  "hp",
  "max_hp",
  "vim",
  "max_vim",
  "mp",
  "max_mp",
  "hero",
  "max_hero",
  "xp",
  "armor",
  "burden",
  "speed",
  "alerts",
  "max_alerts",
  "burning",
  "bleeding",
  "paralysis",
  "stun",
  "actions",
  "reactions",
  ...ATTRIBUTE_DAMAGES,
]);

const attrMaxMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  hp: "max_hp",
  mp: "max_mp",
  vim: "max_vim",
  hero: "max_hero",
  trii: "max_trii",
  alerts: "max_alerts",
};

const attrBaseMap: { [attr in EntityAttribute]?: EntityAttribute } = {
  max_hp: "hp",
  max_mp: "mp",
  max_vim: "vim",
  max_hero: "hero",
  max_trii: "trii",
  max_alerts: "alerts",
};

export const getMaxAttr = (
  attr: EntityAttribute
): EntityAttribute | undefined => {
  if (attr in attrMaxMap) {
    return attrMaxMap[attr];
  }
  return undefined;
};

export const getBaseAttr = (
  attr: EntityAttribute
): EntityAttribute | undefined => {
  if (attr in attrBaseMap) {
    return attrBaseMap[attr];
  }
  return undefined;
};

export const attrFullName = (attr: EntityAttribute): string => {
  const nameMap: Record<EntityAttribute, string> = {
    per: "Perception",
    tek: "Technology",
    agi: "Agility",
    dex: "Dexterity",
    int: "Intelligence",
    spi: "Spirit",
    str: "Strength",
    wis: "Wisdom",
    cha: "Charisma",
    hero: "Hero Points",
  };
  const customName = nameMap[attr];
  if (customName) {
    return customName;
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Maximum " + attrFullName(baseAttr);
  }
  return attrShortName(attr);
};

export const attrShortName = (attr: EntityAttribute): string => {
  const nameMap: Record<EntityAttribute, string> = {
    init: "Initiative",
    // acc: "Accuracy",
    l: "Level",
  };
  const customName = nameMap[attr];
  if (customName) {
    return customName;
  }
  if (attr.length <= 2 || ATTRIBUTES_SET.has(attr)) {
    return attr.toUpperCase();
  }
  const baseAttr = getBaseAttr(attr);
  if (baseAttr !== undefined) {
    return "Max " + attrShortName(baseAttr);
  }
  if (/^[a-z]{3}_dmg$/u.exec(attr)) {
    return `${attrShortName(attr.substring(0, 3))} Damage`;
  }
  return titleText(attr);
};
