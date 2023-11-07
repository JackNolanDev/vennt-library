import { z } from "zod";
import { NAME_MAX, equationValidator } from ".";

export const diceOtherTogglesValidator = z.record(
  z.string(),
  z.object({
    toggled: z.boolean(),
  })
);
export const diceSettingsValidator = z.object({
  explodes: z.boolean().optional(),
  rr1s: z.boolean().optional(),
  drop: z.number().int().optional(),
  fatigued: z.boolean().optional(),
  end: z.string().max(NAME_MAX).optional(),
  flow: z.number().int().optional(),
  ebb: z.number().int().optional(),
  heroic_creativity_bonus: z.number().int().optional(),
  otherToggles: diceOtherTogglesValidator.optional(),
  adjust: equationValidator.optional(),
  count: z.number().optional(),
  sides: z.number().optional(),
});

export type DiceOtherToggles = z.infer<typeof diceOtherTogglesValidator>;
export type DiceSettings = z.infer<typeof diceSettingsValidator>;
