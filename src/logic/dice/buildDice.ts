import {
  DiceSettings,
  DiceCommands,
  ComputedAttributes,
  EntityAttribute,
  DiceToggles,
} from "../..";
import { combineEnabledTogglesSettings } from "./diceSettings";

export const buildDice = (
  count: number,
  sides: number,
  adjust: number | string = 0,
  settings: DiceSettings = {},
  comment = ""
): DiceCommands => {
  let adjustStr = "";
  if (typeof adjust === "string") {
    adjustStr = adjust;
  } else {
    if (adjust > 0) {
      adjustStr = `+${adjust}`;
    } else if (adjust < 0) {
      adjustStr = adjust.toString();
    }
  }

  let heroicCreativityStr = "";
  if (settings.heroic_creativity_bonus) {
    heroicCreativityStr =
      (settings.heroic_creativity_bonus > 0 ? "+" : "") +
      settings.heroic_creativity_bonus.toString();
  }

  let dropLowest = 0;
  let dropHighest = 0;

  const explodeFields = { discord: "", roll20: "", web: "" };
  if (settings.explodes) {
    explodeFields.discord = " ie6";
    explodeFields.roll20 = "!";
    explodeFields.web = "!";
  }
  const rerollFields = { discord: "", roll20: "", web: "" };
  if (settings.rr1s) {
    rerollFields.discord = " ir1";
    rerollFields.roll20 = "r";
    rerollFields.web = "r";
  }
  let fatiguedStr = "";
  if (settings.fatigued) {
    fatiguedStr = "-1";
  }
  let endStr = "";
  if (settings.end) {
    endStr = settings.end;
  }
  if (settings.flow) {
    count += settings.flow;
    dropLowest += settings.flow;
  }
  if (settings.ebb) {
    count += settings.ebb;
    dropHighest += settings.ebb;
  }
  if (settings.drop) {
    dropLowest += settings.drop;
  }
  const dropLowestFields =
    dropLowest === 0
      ? { discord: "", roll20: "", web: "" }
      : {
          discord: ` d${dropLowest}`,
          roll20: `dl${dropLowest}`,
          web: `dl${dropLowest}`,
        };
  const dropHighestFields =
    dropHighest === 0
      ? { discord: "", roll20: "", web: "" }
      : {
          discord: ` kl${count - dropHighest}`,
          roll20: `dh${dropHighest}`,
          web: `dh${dropHighest}`,
        };
  const commentFields = !comment
    ? { discord: "", roll20: "", web: "" }
    : {
        discord: ` ! ${comment}`,
        roll20: ` [${comment}]`,
        web: "",
      };
  return {
    discord:
      count +
      "d" +
      sides +
      explodeFields.discord +
      rerollFields.discord +
      dropLowestFields.discord +
      dropHighestFields.discord +
      " " +
      adjustStr +
      fatiguedStr +
      heroicCreativityStr +
      endStr +
      commentFields.discord,
    roll20:
      count +
      "d" +
      sides +
      explodeFields.roll20 +
      rerollFields.roll20 +
      dropLowestFields.roll20 +
      dropHighestFields.roll20 +
      adjustStr +
      fatiguedStr +
      heroicCreativityStr +
      endStr +
      commentFields.roll20,
    web:
      count +
      "d" +
      sides +
      explodeFields.web +
      rerollFields.web +
      dropLowestFields.web +
      dropHighestFields.web +
      adjustStr +
      fatiguedStr +
      heroicCreativityStr +
      endStr +
      commentFields.web,
    settings: { ...settings, adjust, count, sides },
  };
};

export const defaultDice = (
  attrs: ComputedAttributes,
  attr: EntityAttribute,
  givenSettings: DiceSettings = {},
  diceToggles: DiceToggles = {},
  comment = "",
  skipKey = ""
): DiceCommands => {
  const attrMap = attrs[attr];
  const adjust = attrMap ? attrMap.val : 0;

  let settings = { ...givenSettings };
  settings = combineEnabledTogglesSettings(
    settings,
    diceToggles,
    attrs,
    [attr],
    skipKey
  );
  return buildDice(
    settings.count ?? 3,
    settings.sides ?? 6,
    adjust,
    settings,
    comment
  );
};

export const diceParseFromString = (
  diceStr: string,
  givenSettings: DiceSettings = {},
  comment = "",
  diceToggles: DiceToggles = {},
  attrs?: ComputedAttributes,
  relevantAttrs?: EntityAttribute[]
): DiceCommands | undefined => {
  const match = diceStr.match(/\(?(\d+)\)?d(\d+)/u);
  if (!match || match.length < 3) {
    return undefined;
  }
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  if (isNaN(count) || isNaN(sides)) {
    return undefined;
  }
  const adjust = diceStr.substring(match[0].length);

  let settings = { ...givenSettings };
  if (attrs && relevantAttrs) {
    settings = combineEnabledTogglesSettings(
      settings,
      diceToggles,
      attrs,
      relevantAttrs
    );
  }

  return buildDice(count, sides, adjust, settings, comment);
};
