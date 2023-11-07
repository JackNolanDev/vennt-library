import { z } from "zod";
import { NAME_MAX, ITEM_MAX } from ".";

export const itemFieldsValidator = z.object({
  attr: z.string().max(NAME_MAX).optional(),
  category: z.string().max(NAME_MAX).optional(),
  courses: z.string().max(NAME_MAX).optional(),
  dmg: z.string().max(NAME_MAX).optional(),
  range: z.string().max(NAME_MAX).optional(),
  special: z.string().max(ITEM_MAX).optional(),
  weapon_type: z.string().max(NAME_MAX).optional(), // TODO: replace with enum?
  dc_cost: z.number().int().optional(),
  in_storage: z.boolean().optional(),
  not_evadable: z.boolean().optional(),
});
