import { EntityItem } from "..";

export const ARMOR_ITEM: EntityItem = {
  name: "Hard Leather Vest",
  bulk: 3,
  desc: "Armor Value: 3, Burden: 1",
  type: "armor",
  custom_fields: {},
  uses: {
    adjust: {
      time: "permanent",
      attr: { armor: 3, burden: 1 },
      dice: { str: { explodes: true } },
    },
  },
  comment: null,
  active: true,
};

export const WEAPON_ITEM: EntityItem = {
  name: "Longsword",
  bulk: 2,
  desc: "Balanced weapons are fair and reliable.",
  type: "weapon",
  custom_fields: {
    attr: "str",
    category: "Balanced",
    dmg: "1d6+6",
    range: "",
    weapon_type: "Melee",
  },
  uses: { adjust: { time: "permanent", attr: { free_hands: -1 } } },
  comment: "",
  active: true,
  id: "5d2f9718-0462-441c-afe8-40a705ba34f7",
};
