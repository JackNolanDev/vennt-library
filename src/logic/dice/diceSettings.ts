import {
  DiceSettings,
  EntityAttribute,
  ComputedAttributes,
  DiceToggles,
  replaceVariablesInEquation,
} from "../..";

export const buildSettingsForAttrList = (
  baseSettings: DiceSettings,
  relatedAttrs: EntityAttribute[],
  attrs: ComputedAttributes
): DiceSettings =>
  relatedAttrs.reduce((settings, attr) => {
    const attrMap = attrs[attr];
    if (!attrMap?.dice) {
      return settings;
    }
    return combineDiceSettings(settings, attrMap.dice, attrs);
  }, baseSettings);

export const combineEnabledTogglesSettings = (
  settings: DiceSettings,
  diceToggles: DiceToggles,
  attrs: ComputedAttributes,
  relevantAttrs: EntityAttribute[],
  skipKey = ""
): DiceSettings => {
  Object.entries(diceToggles).forEach(([key, toggle]) => {
    if (
      settings.otherToggles &&
      (settings.otherToggles[key]?.toggled ?? toggle.default) &&
      toggle.attr &&
      relevantAttrs.includes(toggle.attr) &&
      skipKey !== key
    ) {
      settings = combineDiceSettings(settings, toggle.setting, attrs);
    }
  });
  return buildSettingsForAttrList(settings, relevantAttrs, attrs);
};

export const combineDiceSettings = (
  baseSettings: DiceSettings,
  newSettings: DiceSettings,
  attrs: ComputedAttributes
): DiceSettings => {
  const settings = {
    ...baseSettings,
  };
  if (newSettings.count) {
    settings.count = (settings.count ?? 3) + newSettings.count;
  }
  if (newSettings.sides) {
    settings.sides = (settings.sides ?? 6) + newSettings.sides;
  }
  if (newSettings.drop) {
    settings.drop = (settings.drop ?? 0) + newSettings.drop;
  }
  if (newSettings.ebb) {
    settings.ebb = (settings.ebb ?? 0) + newSettings.ebb;
  }
  if (newSettings.flow) {
    settings.flow = (settings.flow ?? 0) + newSettings.flow;
  }
  if (newSettings.end) {
    settings.end = replaceVariablesInEquation(
      `${settings.end ?? ""}${newSettings.end}`,
      attrs
    ).cleanedEquation;
  }
  if (newSettings.explodes) {
    settings.explodes = true;
  }
  if (newSettings.rr1s) {
    settings.rr1s = true;
  }
  if (newSettings.fatigued) {
    settings.fatigued = true;
  }
  return settings;
};
