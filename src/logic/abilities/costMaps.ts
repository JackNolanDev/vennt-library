import {
  AbilityCostMap,
  AbilityCostMapBoolean,
  AbilityCostMapNumber,
  numericAbilityCostKeys,
} from "../..";

export const addAbilityCostMaps = (
  a: AbilityCostMap,
  b: AbilityCostMap
): AbilityCostMap => {
  const addNumericKeys = (key: keyof AbilityCostMapNumber): number =>
    (a[key] ?? 0) + (b[key] ?? 0);
  const addBooleanKeys = (
    key: keyof AbilityCostMapBoolean
  ): boolean | undefined => a[key] || b[key];
  const sumMap: AbilityCostMap = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  keys.forEach((key) => {
    const numericKey = key as keyof AbilityCostMapNumber;
    const booleanKey = key as keyof AbilityCostMapBoolean;
    if (numericAbilityCostKeys.includes(numericKey)) {
      sumMap[numericKey] = addNumericKeys(numericKey);
    } else {
      sumMap[booleanKey] = addBooleanKeys(booleanKey);
    }
  });
  return sumMap;
};

const numberLabelRegex = "\\s*(?<label>mp|vim|hp|hero point|action|reaction)?";

const tripleRegex =
  "\\[\\s(?<spell_half>.*)\\s\\/\\s(?<spell_regular>.*)\\s\\/\\s(?<spell_double>.*)\\s\\]";
const labelledTripleRegex = `${tripleRegex}${numberLabelRegex}`;

const numberRegex = "(?<number>-?\\d+|an?)(?:-\\d+)?\\*?";
const labelledNumberRegex = `${numberRegex}${numberLabelRegex}`;

const regexNumberLabelToKey: Record<string, keyof AbilityCostMapNumber> = {
  mp: "mp",
  vim: "vim",
  hp: "hp",
  "hero point": "hero",
  action: "actions",
  reaction: "reactions",
};
const getNumberCostKey = (
  label: string | undefined
): keyof AbilityCostMapNumber | undefined =>
  label ? regexNumberLabelToKey[label.toLowerCase()] : undefined;

const activationBooleanRegex: Record<keyof AbilityCostMapBoolean, RegExp> = {
  attack: /attack/i,
  passive: /passive/i,
  respite: /respite/i,
  rest: /rest/i,
  intermission: /intermission/i,
};

export const parseActivationCostMap = (
  activation: string
): { cost: AbilityCostMap; spellCost?: AbilityCostMap[] } => {
  const costMap: AbilityCostMap = {};
  const spellCostMaps: AbilityCostMap[] = [{}, {}, {}];
  const splitText = activation.split(/,(?![^[]*])/g);
  splitText.forEach((text) => {
    const tripleMatch = text.match(new RegExp(labelledTripleRegex, "i"));
    if (
      tripleMatch &&
      tripleMatch.length > 0 &&
      tripleMatch.groups &&
      tripleMatch.groups.spell_half &&
      tripleMatch.groups.spell_regular &&
      tripleMatch.groups.spell_double
    ) {
      const innerMatches = [
        tripleMatch.groups.spell_half,
        tripleMatch.groups.spell_regular,
        tripleMatch.groups.spell_double,
      ];
      const label = getNumberCostKey(tripleMatch.groups.label);
      if (label) {
        innerMatches.forEach((innerNumber, idx) => {
          const numberMatch = innerNumber.match(new RegExp(numberRegex));
          if (
            numberMatch &&
            numberMatch.length > 0 &&
            numberMatch.groups?.number
          ) {
            const val = parseInt(numberMatch.groups.number);
            if (!isNaN(val) && val !== 0) {
              spellCostMaps[idx][label] = val;
            }
          }
        });
      } else {
        innerMatches.map(parseActivationCostMap).forEach(({ cost }, idx) => {
          spellCostMaps[idx] = addAbilityCostMaps(spellCostMaps[idx], cost);
        });
      }
      return;
    }
    const numberMatch = text.match(new RegExp(labelledNumberRegex, "i"));
    if (numberMatch && numberMatch.length > 0 && numberMatch.groups?.number) {
      const label = getNumberCostKey(numberMatch.groups.label);
      if (label) {
        const val = parseInt(numberMatch.groups.number);
        if (!isNaN(val) && val !== 0 && label) {
          costMap[label] = val;
        } else if (["a", "an"].includes(numberMatch.groups.number)) {
          costMap[label] = 1;
        }
      }
    }
    Object.entries(activationBooleanRegex).forEach(([keyIn, regex]) => {
      const key = keyIn as keyof AbilityCostMapBoolean;
      const match = text.match(regex);
      if (match && match.length > 0) {
        costMap[key] = true;
      }
    });
  });

  const includeSpellCost =
    spellCostMaps.length === 3 &&
    spellCostMaps.some((map) => Object.keys(map).length > 0);

  return {
    cost: costMap,
    ...(includeSpellCost && { spellCost: spellCostMaps }),
  };
};
