import { describe, expect, test } from "bun:test";
import { CollectedEntity, EntityAttribute, EntityAttributes } from "../..";
import { computeAttributes } from "./computedAttributes";

const buildEntity = (
  attrsOverride?: Partial<EntityAttributes>
): CollectedEntity => ({
  entity: {
    name: "Test",
    type: "CHARACTER",
    attributes: {
      agi: 0,
      cha: 0,
      dex: 0,
      int: 0,
      per: 0,
      spi: 0,
      str: 3,
      tek: 0,
      wis: 2,
      hp: 10,
      max_hp: 0,
      mp: 5,
      max_mp: 0,
      vim: 15,
      max_vim: 0,
      init: 0,
      speed: 0,
      ...attrsOverride,
    },
    other_fields: {},
    public: false,
  },
  abilities: [],
  items: [],
  text: [],
  flux: [],
});

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
  ];

  test.each(testCases)("%s", (_label, entity, expectedAttrVal) => {
    const result = computeAttributes(entity);
    Object.entries(expectedAttrVal ?? {}).forEach(([attr, expectedVal]) => {
      expect(result[attr]?.val).toBe(expectedVal);
    });
  });
});
