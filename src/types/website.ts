import {
  DiceSettings,
  EntityAbility,
  EntityAttribute,
  EntityItem,
  FullEntityItem,
} from ".";

export type HTMLString = string;

export type SaveState = "EDITING" | "SAVING" | "SAVED";

export type UpdatedEntityAttribute = {
  base?: number;
  val: number;
  reason?: string[];
  items?: EntityItem[];
  abilities?: EntityAbility[];
  dice?: DiceSettings;
};

export type UpdatedEntityAttributes = Partial<
  Record<string, UpdatedEntityAttribute>
>;

export type DiceToggle = {
  attr?: EntityAttribute;
  setting: DiceSettings;
  default?: boolean; // currently not really supported
  label?: string;
  src?: { ability_id?: string; item_id?: string };
};
export type DiceToggles = {
  [key: string]: DiceToggle;
};
export type DiceCommands = {
  discord: string;
  roll20: string;
  web: string;
  settings: DiceSettings;
  comment?: string;
};

export type ConsolidatedItem = FullEntityItem & {
  ids: string[];
};

export type PathTree = Record<
  string,
  { children: PathTree; abilities: string[] }
>;
