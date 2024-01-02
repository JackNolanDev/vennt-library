import { MIN_ZEROS, solveEquation } from "..";
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_ATTRS_MAP,
  DEFAULT_CHARACTER_ADJUSTMENTS,
} from "../../config";
import {
  CollectedEntity,
  ComputedAttributes,
  DiceSettings,
  EntityAbility,
  EntityAttribute,
  EntityItem,
  Equation,
  FullEntityAbility,
  FullEntityItem,
  PartialEntityAttributes,
  UseCriteria,
  UsesAdjust,
} from "../../types";
import { abilityExtendEntityAttributes } from "../abilities";
import { abilityPassCriteriaCheck } from "../criteria";
import { combineDiceSettings } from "../dice";

export const ORDER_PRE_ATTR = 10;
export const ORDER_ATTR = 20;
export const ORDER_XP = 30;
export const ORDER_BASE_COMBAT_STAT = 40;
export const ORDER_ARMOR = 50;
export const ORDER_COMBAT_STAT = 60;
export const ORDER_CUSTOM_ATTR = 1000;
export const ORDER_LAST = 10000;

const orderForAttr = (
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
  src?:
    | { type: "item"; item: EntityItem }
    | { type: "ability"; ability: EntityAbility };
  criteria?: { id: string; check: UseCriteria };
  builtIn?: boolean;
}

// TODO: It may be worthwhile building a dependency graph of all attributes and their dependencies
// We would have to go through the graph and prune any loops, then work through the graph in order

export const computeAttributes = (
  entity: CollectedEntity
): ComputedAttributes => {
  const attrs: ComputedAttributes = {};
  const initAttrs = (map: PartialEntityAttributes, reasonStr: string) => {
    Object.entries(map).forEach(([attr, val]) => {
      attrs[attr as EntityAttribute] = {
        val,
        base: val,
        reason: [{ val: val, src: reasonStr }],
      };
    });
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
    builtIn: true,
  }));

  // 2. collect adjustments from items
  entity.items.forEach((item) => {
    if (
      !item.uses?.adjust ||
      !(item.active || item.type === "equipment") ||
      item.custom_fields?.in_storage
    ) {
      return;
    }
    const src = { type: "item" as const, item };
    if (item.uses.adjust.attr) {
      Object.entries(item.uses.adjust.attr).forEach(([attr, eq]) => {
        const order = item.uses?.adjust?.order ?? orderForAttr(attr, eq);
        pendingAdjustments.push({ attr, adjust: eq, order, src });
      });
    }
    if (item.uses.adjust.dice) {
      Object.entries(item.uses.adjust.dice).forEach(([attr, dice]) => {
        const order = item.uses?.adjust?.order ?? ORDER_LAST;
        pendingAdjustments.push({ attr, adjust: dice, order, src });
      });
    }
  });

  // 3. collect adjustments from abilities
  entity.abilities.forEach((ability, abilityIdx) => {
    const adjusts: Array<{
      adjust?: UsesAdjust;
      check?: UseCriteria;
      checkId?: string;
    }> =
      ability.uses?.criteria_benefits
        ?.filter((criteria) => criteria.adjust)
        .map((criteria, criteriaIdx) => ({
          adjust: criteria.adjust,
          check: criteria.criteria,
          checkId: `${abilityIdx}_${criteriaIdx}`,
        })) ?? [];
    adjusts.push({ adjust: ability.uses?.adjust });
    adjusts.forEach(({ adjust, check, checkId }) => {
      if (!adjust || (adjust.time !== "permanent" && !ability.active)) {
        return;
      }
      const src = { type: "ability" as const, ability };
      const criteria = check && checkId ? { id: checkId, check } : undefined;
      if (adjust.attr) {
        Object.entries(adjust.attr).forEach(([attr, eq]) => {
          const order = adjust?.order ?? orderForAttr(attr, eq);
          pendingAdjustments.push({ attr, adjust: eq, order, src, criteria });
        });
      }
      if (adjust.dice) {
        Object.entries(adjust.dice).forEach(([attr, dice]) => {
          const order = adjust?.order ?? ORDER_LAST;
          pendingAdjustments.push({ attr, adjust: dice, order, src, criteria });
        });
      }
    });
  });

  // 4. sort pending adjustments
  pendingAdjustments.sort((a, b) => a.order - b.order);

  // 5. apply pending adjustments
  const appendReason = (
    attr: EntityAttribute,
    src: string,
    itemId?: string,
    abilityId?: string
  ) => {
    const reason = {
      val: attrs[attr].val,
      src,
      ...(itemId && { itemId }),
      ...(abilityId && { abilityId }),
    };
    const reasonCheck = attrs[attr].reason;
    if (reasonCheck) {
      reasonCheck.push(reason);
    } else {
      attrs[attr].reason = [reason];
    }
  };

  // When a criteria effects multiple attributes, we only want to run the expensive criteria calculation once, so we cache results here
  const criteriaResult: Record<string, boolean> = {};
  pendingAdjustments.forEach(({ attr, adjust, src, criteria, builtIn }) => {
    if (criteria && src?.type === "ability") {
      let criteriaSuccessful = criteriaResult[criteria.id];
      if (typeof criteriaSuccessful !== "boolean") {
        criteriaSuccessful = abilityPassCriteriaCheck(
          criteria.check,
          src.ability,
          null,
          attrs
        );
        criteriaResult[criteria.id] = criteriaSuccessful;
      }
      if (!criteriaSuccessful) {
        // Do not apply unsuccessful criteria
        return;
      }
    }
    const attrCheck = attrs[attr];
    if (!attrCheck) {
      attrs[attr] = { val: 0 };
    }
    let srcName: string | null = null;
    let itemId: string | undefined = undefined;
    let abilityId: string | undefined = undefined;
    if (src?.type === "item") {
      srcName = src.item.name;
      itemId = (src.item as FullEntityItem).id;
    } else if (src?.type === "ability") {
      srcName = src.ability.name;
      abilityId = (src.ability as FullEntityAbility).id;
    } else if (builtIn) {
      srcName = "Base Equations";
    }
    if (typeof adjust === "number") {
      // basic +/- attribute adjustment
      attrs[attr].val += adjust;
      const reason = `${attr} ${adjust >= 0 ? "+" : "-"} ${Math.abs(adjust)} ${
        srcName ? `(From ${srcName})` : ""
      }`;
      appendReason(attr, reason, itemId, abilityId);
    } else {
      const extendedAttrs =
        src?.type === "ability"
          ? abilityExtendEntityAttributes(src.ability, attrs)
          : attrs;
      if (typeof adjust === "string") {
        // equation-based attribute adjustment
        const newVal = solveEquation(adjust, extendedAttrs);
        if (newVal) {
          attrs[attr].val = newVal;
          const reason = `${adjust} ${srcName ? `(From ${srcName})` : ""}`;
          appendReason(attr, reason, itemId, abilityId);
        }
      } else {
        // effects dice rolls for attribute
        const diceCheck = attrs[attr].dice;
        if (diceCheck) {
          attrs[attr].dice = combineDiceSettings(
            diceCheck,
            adjust,
            extendedAttrs
          );
        } else {
          attrs[attr].dice = adjust;
        }
      }
    }
  });

  // 6. enforce zero minimums
  Object.entries(attrs).forEach(([attr, details]) => {
    if (details && details.val < 0 && MIN_ZEROS.has(attr)) {
      details.val = 0;
      appendReason(attr, `${attr}'s minimum value is 0`);
    }
  });

  return attrs;
};
