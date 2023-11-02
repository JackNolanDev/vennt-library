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

  const testCases: TestCase[] = [
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
  ];

  test.each(testCases)("%s", (_label, entity, expectedAttrVal) => {
    const result = computeAttributes(entity);
    Object.entries(expectedAttrVal ?? {}).forEach(([attr, expectedVal]) => {
      expect(result[attr]?.val).toBe(expectedVal);
    });
  });
});
