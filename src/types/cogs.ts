import { z } from "zod";
import { baseAttributeFieldValidator } from ".";

export const COG_ATTRIBUTE_LEVELS = [
  "weak",
  "moderate",
  "strong",
  "exceptional",
] as const;

export const cogAttributeLevelValidator = z.enum(COG_ATTRIBUTE_LEVELS);

export const cogCreateOptionsValidator = z.object({
  name: z.string(),
  level: z.string().or(z.number()),
  type: z.string(),
  desc: z.string(),
  attrOverrides: z.record(
    baseAttributeFieldValidator,
    cogAttributeLevelValidator
  ),
  abilitySelection: z.record(z.string(), z.string()),
  variableAbilityCost: z.record(z.string(), z.string().or(z.number())),
});

export type CogAttributeLevel = z.infer<typeof cogAttributeLevelValidator>;
export type CogCreateOptions = z.infer<typeof cogCreateOptionsValidator>;
