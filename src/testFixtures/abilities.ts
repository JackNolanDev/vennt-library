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
