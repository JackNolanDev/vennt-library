import { describe, expect, test } from "bun:test";
import { ComputedAttributes } from "../..";
import { defaultDice } from "./buildDice";

const TEST_ATTRS: ComputedAttributes = {
  wis: { val: 4 },
  str: { val: 2, dice: { flow: 1 } },
  dmg: { val: 0, dice: { end: "+str" } },
  blade_dmg: { val: 1, dice: { count: 1 } },
};

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