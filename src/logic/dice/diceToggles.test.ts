import { describe, expect, test } from "bun:test";
import {
  ARMOR_ITEM,
  DEX_DICE_TOGGLE_ABILITY,
  DEX_EXPLODES_DICE_TOGGLE_ABILITY,
  SHIELD_WHEN_HEALTHY,
  STR_DICE_TOGGLE_ITEM,
  WEAPON_ITEM,
  buildEntity,
} from "../../testFixtures";
import { diceTogglesForEntity } from "./diceToggles";
import { computeAttributes } from "..";

describe("diceTogglesForEntity", () => {
  test("toggle src added", () => {
    const entity = buildEntity(
      {},
      [
        SHIELD_WHEN_HEALTHY,
        DEX_DICE_TOGGLE_ABILITY,
        DEX_EXPLODES_DICE_TOGGLE_ABILITY,
      ],
      [ARMOR_ITEM, WEAPON_ITEM, STR_DICE_TOGGLE_ITEM]
    );
    const attrs = computeAttributes(entity);
    const toggles = diceTogglesForEntity(entity, attrs);
    expect(toggles).toStrictEqual({
      [DEX_DICE_TOGGLE_ABILITY.name]: {
        attr: "dex",
        setting: { end: "+2" },
        src: { ability_id: "459115c3-1912-41f2-8b79-a56594bf18c1" },
      },
      [DEX_EXPLODES_DICE_TOGGLE_ABILITY.name]: {
        attr: "dex",
        setting: { explodes: true },
      },
      [STR_DICE_TOGGLE_ITEM.name]: {
        attr: "str",
        setting: { flow: 1 },
        src: { item_id: "3454d2af-d63d-4c15-b036-6f385c52927e" },
      },
    });
  });
});
