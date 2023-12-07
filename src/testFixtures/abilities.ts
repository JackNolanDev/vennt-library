import { EntityAbility } from "..";

export const SHIELD_WHEN_HEALTHY: EntityAbility = {
  name: "Shield When Healthy",
  effect: "Get shield when healthy but double all burden",
  custom_fields: {},
  uses: {
    criteria_benefits: [
      {
        criteria: {
          type: "comp",
          left: { type: "attr", attr: "hp" },
          right: { type: "attr", attr: "max_hp" },
          operator: "gte",
        },
        adjust: {
          time: "permanent",
          attr: { shield: 2, burden: "burden * 2" },
          dice: { str: { end: "+1" } },
        },
      },
    ],
  },
  active: false,
};

export const DEX_DICE_TOGGLE_ABILITY: EntityAbility = {
  name: "dex toggle",
  effect: "Causes a DEX toggle to appear",
  custom_fields: {},
  uses: { check: { bonus: "+2", attr: "dex" } },
  active: false,
  id: "459115c3-1912-41f2-8b79-a56594bf18c1",
};

export const DEX_EXPLODES_DICE_TOGGLE_ABILITY: EntityAbility = {
  name: "dex explodes toggle",
  effect: "Causes a DEX toggle to appear",
  custom_fields: {},
  uses: { check: { dice_settings: { explodes: true }, attr: "dex" } },
  active: false,
};
