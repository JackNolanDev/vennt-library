import { describe, expect, test } from "bun:test";
import { ComputedAttributes, DiceSettings } from "../..";
import { buildDice, defaultDice, diceParseFromString } from "./buildDice";

const TEST_ATTRS: ComputedAttributes = {
  wis: { val: 4 },
  str: { val: 2, dice: { flow: 1 } },
  dmg: { val: 0, dice: { end: "+str" } },
  blade_dmg: { val: 1, dice: { count: 1 } },
};

describe("buildDice", () => {
  test("comment is returned", () => {
    const result = buildDice(1, 6, undefined, undefined, "test check");
    expect(result).toStrictEqual({
      web: "1d6",
      discord: "1d6  ! test check",
      roll20: "1d6 [test check]",
      settings: { adjust: 0, count: 1, sides: 6 },
      comment: "test check",
    });
  });

  describe("web dice", () => {
    const testCases: Array<[string, DiceSettings, string]> = [
      ["flow is supported", { flow: 1 }, "2d6dl1"],
      ["ebb is supported", { ebb: 2 }, "3d6dh2"],
      ["flow & ebb are ignored if they equal", { flow: 5, ebb: 5 }, "1d6"],
      ["flow is larger than ebb", { flow: 5, ebb: 3 }, "3d6dl2"],
      ["ebb is larger than flow", { flow: 3, ebb: 4 }, "2d6dh1"],
    ];

    test.each(testCases)("%s", (_label, diceSettings, expected) => {
      const result = buildDice(1, 6, undefined, diceSettings);
      expect(result.web).toBe(expected);
    });
  });
});

describe("defaultDice", () => {
  test("expect basic 3d6 format", () => {
    const result = defaultDice(TEST_ATTRS, "wis");
    expect(result.settings).toStrictEqual({
      adjust: 4,
      count: 3,
      sides: 6,
    });
  });
  test("flow effects dice count in output", () => {
    const result = defaultDice(TEST_ATTRS, "wis", { flow: 1 });
    expect(result.settings).toStrictEqual({
      adjust: 4,
      count: 4,
      sides: 6,
      flow: 1,
    });
  });
  test("dice settings in computed attributes are handled", () => {
    const result = defaultDice(TEST_ATTRS, "str", { flow: 1 });
    expect(result.settings).toStrictEqual({
      adjust: 2,
      count: 5,
      sides: 6,
      flow: 2,
    });
  });
});

describe("diceParseFromString", () => {
  test("simple dice parse", () => {
    const result = diceParseFromString("3d6+5");
    expect(result?.settings).toStrictEqual({
      adjust: "+5",
      count: 3,
      sides: 6,
    });
    expect(result?.web).toBe("3d6+5");
  });
  test("undefined when no valid dice formula", () => {
    const result = diceParseFromString("hello");
    expect(result).toBeUndefined();
  });
  test("attrs are replaced in the equation when provided", () => {
    const result = diceParseFromString(
      "(str)d4-wis",
      {},
      undefined,
      undefined,
      TEST_ATTRS
    );
    expect(result?.settings).toStrictEqual({
      adjust: "-4",
      count: 2,
      sides: 4,
    });
    expect(result?.web).toBe("2d4-4");
  });
});
