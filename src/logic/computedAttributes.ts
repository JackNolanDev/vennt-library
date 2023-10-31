import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_ATTRS_MAP,
  DEFAULT_CHARACTER_ADJUSTMENTS,
} from "../config";
import {
  CollectedEntity,
  ComputedAttributes,
  DiceSettings,
  EntityAttribute,
  Equation,
  FullEntityItem,
  PartialEntityAttributes,
  UseCriteria,
} from "../types";
import { combineDiceSettings } from "./dice";

export const ORDER_PRE_ATTR = 10;
export const ORDER_ATTR = 20;
export const ORDER_XP = 30;
export const ORDER_BASE_COMBAT_STAT = 40;
export const ORDER_ARMOR = 50;
export const ORDER_COMBAT_STAT = 60;
export const ORDER_CUSTOM_ATTR = 1000;

export const orderForAttr = (
  attr: EntityAttribute,
  adjust: Equation | DiceSettings
): number => {
  let offset = 0;
  if (typeof adjust === "string") {
    const additionRegex = new RegExp(`^\\s*${attr}\\s*[+-]`, "u");
    offset = additionRegex.test(adjust) ? 2 : 4;
  }
  switch (attr) {
    case "agi_dmg":
    case "cha_dmg":
    case "dex_dmg":
    case "int_dmg":
    case "per_dmg":
    case "spi_dmg":
    case "str_dmg":
    case "tek_dmg":
    case "wis_dmg":
      return ORDER_PRE_ATTR + offset;
    case "per":
    case "tek":
    case "agi":
    case "dex":
    case "int":
    case "spi":
    case "str":
    case "wis":
    case "cha":
      return ORDER_ATTR + offset;
    case "xp":
    case "sp":
      return ORDER_XP + offset;
    case "hp":
    case "max_hp":
    case "vim":
    case "max_vim":
    case "mp":
    case "max_mp":
    case "hero":
    case "max_hero":
    case "alerts":
    case "max_alerts":
      return ORDER_BASE_COMBAT_STAT + offset;
    case "armor":
    case "shield":
    case "burden":
      return ORDER_ARMOR + offset;
    case "init":
    case "speed":
    case "casting":
    case "bluespace":
    case "actions":
    case "reactions":
    case "actions_on_turn":
    case "reactions_on_turn":
    case "heroic_creativity_bonus":
    case "free_hands":
    case "recovery_shock":
      return ORDER_COMBAT_STAT + offset;
    default:
      return ORDER_CUSTOM_ATTR + offset;
  }
};

interface PendingAdjustment {
  attr: EntityAttribute;
  adjust: Equation | DiceSettings;
  order: number;
  src?: { type: "ability" | "item"; id: string; name: string };
  criteria?: { id: string; check: UseCriteria };
}

export const computeAttributes = (
  entity: CollectedEntity
): ComputedAttributes => {
  const attrs: ComputedAttributes = {};
  const initAttrs = (map: PartialEntityAttributes, reasonStr: String) => {
    Object.entries(map).forEach(([attr, val]) => {
      attrs[attr as EntityAttribute] = {
        val,
        base: val,
        reason: [{ val: val, src: `${reasonStr}: ${val}` }],
      };
    });
  };

  const ensureDefaultAttrVal = (attr: EntityAttribute) => {
    const attrCheck = attrs[attr];
    if (attrCheck === undefined) {
      attrs[attr] = { val: 0 };
    }
  };

  const appendDiceAdjust = (attr: EntityAttribute, dice: DiceSettings) => {
    ensureDefaultAttrVal(attr);
    const attrMap = attrs[attr]!;
    if (!attrMap.dice) {
      attrMap.dice = dice;
    } else {
      attrMap.dice = combineDiceSettings(attrMap.dice, dice, attrs);
    }
  };

  // 0. initialize attrs with default attributes
  initAttrs(DEFAULT_ATTRS_MAP, "Default");
  initAttrs(entity.entity.attributes, "Base Value");

  // 1. collect base adjustments
  const pendingAdjustments: PendingAdjustment[] = [
    ...DEFAULT_ADJUSTMENTS,
    ...(entity.entity.type === "CHARACTER"
      ? DEFAULT_CHARACTER_ADJUSTMENTS
      : []),
  ].map(({ attr, eq }) => ({
    attr,
    adjust: eq,
    order: orderForAttr(attr, eq),
  }));

  // 2. collect adjustments from items
  entity.items.forEach((item) => {
    if (
      item.uses?.adjust &&
      (item.active || item.type === "equipment") &&
      !item.custom_fields?.in_storage
    ) {
      if (item.uses.adjust.attr) {
        Object.entries(item.uses.adjust.attr).forEach(([attr, adjust]) => {
          const work: PendingAdjustment = {
            attr,
            adjust,
            order: item.uses?.adjust?.order ?? orderForAttr(attr, adjust),
          };
          const id = (item as FullEntityItem).id;
          if (id) {
            work.src = { type: "item", id, name: item.name };
          }
          pendingAdjustments.push(work);
        });
      }
      if (item.uses.adjust.dice) {
      }
    }
  });

  return attrs;
};
