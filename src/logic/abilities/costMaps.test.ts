import { describe, expect, test } from "bun:test";
import {
  AbilityCostMap,
  addAbilityCostMaps,
  parseActivationCostMap,
} from "../..";

describe("addAbilityCostMaps", () => {
  const testCases: Array<[AbilityCostMap, AbilityCostMap, AbilityCostMap]> = [
    [{}, {}, {}],
    [{ vim: 4 }, { rest: true, mp: 3 }, { mp: 3, vim: 4, rest: true }],
    [
      { mp: 2, intermission: true },
      { mp: 3, hero: 2 },
      { mp: 5, hero: 2, intermission: true },
    ],
  ];

  test.each(testCases)("%j + %j", (a, b, expected) => {
    const result = addAbilityCostMaps(a, b);
    expect(result).toStrictEqual(expected);
  });
});

describe("parseActivationCostMap", () => {
  const testCases: Array<
    [string, AbilityCostMap, AbilityCostMap[] | undefined]
  > = [
    ["Spec.", {}, undefined],
    ["Passive", { passive: true }, undefined],
    ["Intermission", { intermission: true }, undefined],
    ["Attack, 3 Vim", { attack: true, vim: 3 }, undefined],
    ["Respite, 5 Vim", { respite: true, vim: 5 }, undefined],
    ["Rest", { rest: true }, undefined],
    ["Free Reaction, 1 MP", { mp: 1 }, undefined],
    ["1 Hero Point", { hero: 1 }, undefined],
    ["1 Reaction, * MP", { reactions: 1 }, undefined],
    ["1 Action, 3 Vim", { actions: 1, vim: 3 }, undefined],
    ["1 Reaction, 2 HP", { reactions: 1, hp: 2 }, undefined],
    ["2 Actions, 4 MP, 2 Vim", { actions: 2, mp: 4, vim: 2 }, undefined],
    ["2 Actions, 0-3* MP", { actions: 2 }, undefined],
    ["2 Actions, 1-3* MP", { actions: 2, mp: 1 }, undefined],
    ["2 Actions, 2* MP", { actions: 2, mp: 2 }, undefined],
    ["1 Action, X MP up to SPI", { actions: 1 }, undefined],
    ["-1 Vim", { vim: -1 }, undefined],
    ["an Action", { actions: 1 }, undefined],
    ["a Reaction", { reactions: 1 }, undefined],
    // TODO: FIX ALL BELOW
    [
      "1 Action, [ 1 / 2 / 4 ] MP",
      { actions: 1 },
      [{ mp: 1 }, { mp: 2 }, { mp: 4 }],
    ],
    [
      "1 Action, [ 1 MP / 2 MP / 4 Vim ]",
      { actions: 1 },
      [{ mp: 1 }, { mp: 2 }, { vim: 4 }],
    ],
    [
      "1 Action, [ 1 MP / 2 MP / 4 Vim ] HP",
      { actions: 1 },
      [{ hp: 1 }, { hp: 2 }, { hp: 4 }],
    ],
    [
      "[ 1 / 2 / 3 ] Actions",
      {},
      [{ actions: 1 }, { actions: 2 }, { actions: 3 }],
    ],
    [
      "[ 3 / 2 / 1 ] Action(s)",
      {},
      [{ actions: 3 }, { actions: 2 }, { actions: 1 }],
    ],
    [
      "[ 2 Actions / 2 Actions / 3 Actions ]",
      {},
      [{ actions: 2 }, { actions: 2 }, { actions: 3 }],
    ],
    [
      "[ 2 Actions / 1 Action / 1 Reaction ]",
      {},
      [{ actions: 2 }, { actions: 1 }, { reactions: 1 }],
    ],
    [
      "[ Intermission / Rest / Respite ]",
      {},
      [{ intermission: true }, { rest: true }, { respite: true }],
    ],
    [
      "1 MP, [ Intermission, 1 Vim / Rest, 2 Vim / Respite, 5 Vim ]",
      { mp: 1 },
      [
        { intermission: true, vim: 1 },
        { rest: true, vim: 2 },
        { respite: true, vim: 5 },
      ],
    ],
    [
      "1 Action, [ 1 / 2 / 4 ] MP, [ 2 MP / 3 MP / 5 MP ]",
      { actions: 1 },
      [{ mp: 3 }, { mp: 5 }, { mp: 9 }],
    ],
  ];

  test.each(testCases)(
    "parse '%s'",
    (activation, expectedCost, expectedSpellCost) => {
      const { cost, spellCost } = parseActivationCostMap(activation);
      expect(cost).toStrictEqual(expectedCost);
      expect(spellCost).toStrictEqual(expectedSpellCost as any);
    }
  );
});
