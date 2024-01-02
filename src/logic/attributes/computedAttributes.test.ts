import { describe, expect, test } from "bun:test";
import { CollectedEntity, EntityAttribute } from "../..";
import { computeAttributes } from "./computedAttributes";
import {
  ARMOR_ITEM,
  SHIELD_WHEN_HEALTHY,
  WEAPON_ITEM,
  buildEntity,
} from "../../testFixtures";

describe("computeAttributes", () => {
  type TestCase = [string, CollectedEntity, Record<EntityAttribute, number>];

  const mathTestCases: TestCase[] = [
    ["default attributes are set", buildEntity(), { free_hands: 2 }],
    ["base entity attributes are set", buildEntity(), { str: 3 }],
    [
      "base entity attributes override default attributes",
      buildEntity({ free_hands: 1 }),
      { free_hands: 1 },
    ],
    [
      "combat stats are calculated for characters",
      buildEntity({ cha_dmg: 1, hp: 10, max_hp: 2 }),
      { cha: -1, hp: 10, max_hp: 31 },
    ],
    [
      "items and abilities effect attributes",
      buildEntity(
        { hp: 30, max_hp: 1 },
        [SHIELD_WHEN_HEALTHY],
        [ARMOR_ITEM, WEAPON_ITEM]
      ),
      { hp: 30, max_hp: 30, free_hands: 1, armor: 3, shield: 2, burden: 2 },
    ],
    [
      "failed criteria are not applied",
      buildEntity({ hp: 5, max_hp: 1 }, [SHIELD_WHEN_HEALTHY], [ARMOR_ITEM]),
      { hp: 5, max_hp: 30, armor: 3, burden: 1 },
    ],
    [
      "zero minimums are enforced",
      buildEntity({ speed: -2, agi: -3, sp: -100 }),
      { speed: 0, sp: -100 },
    ],
  ];

  test.each(mathTestCases)("%s", (_label, entity, expectedAttrVal) => {
    const result = computeAttributes(entity);
    Object.entries(expectedAttrVal ?? {}).forEach(([attr, expectedVal]) => {
      expect(result[attr]?.val).toBe(expectedVal);
    });
  });

  test("reasons are generated", () => {
    const entity = buildEntity(
      { hp: 30, cha: 2, cha_dmg: 1 },
      [SHIELD_WHEN_HEALTHY],
      [WEAPON_ITEM, ARMOR_ITEM]
    );
    const attrs = computeAttributes(entity);
    expect(attrs.cha.reason).toStrictEqual([
      { src: "Base Value", val: 2 },
      { src: "cha - cha_dmg (From Base Equations)", val: 1 },
    ]);
    expect(attrs.burden.reason).toStrictEqual([
      { src: "burden + 1 (From Hard Leather Vest)", val: 1 },
      { src: "burden * 2 (From Shield When Healthy)", val: 2 },
    ]);
    expect(attrs.free_hands.reason).toStrictEqual([
      { src: "Default", val: 2 },
      {
        src: "free_hands - 1 (From Longsword)",
        val: 1,
        itemId: "5d2f9718-0462-441c-afe8-40a705ba34f7",
      },
    ]);
  });

  test("attribute dice settings are generated", () => {
    const entity = buildEntity({ hp: 30 }, [SHIELD_WHEN_HEALTHY], [ARMOR_ITEM]);
    const attrs = computeAttributes(entity);
    expect(attrs.str.dice).toStrictEqual({ end: "+1", explodes: true });
  });
});
