import { z } from "zod";
import {
  NAME_MAX,
  ITEM_MAX,
  COMMENT_MAX,
  idValidator,
  nameValidator,
  usesValidator,
} from ".";

export const ITEM_TYPE_EQUIPMENT = "equipment";
export const ITEM_TYPE_CONSUMABLE = "consumable";
export const ITEM_TYPE_CONTAINER = "container";
export const ITEM_TYPE_ARMOR = "armor";
export const ITEM_TYPE_SHIELD = "shield";
export const ITEM_TYPE_WEAPON = "weapon";

export const itemTypeValidator = z.enum([
  ITEM_TYPE_EQUIPMENT,
  ITEM_TYPE_CONSUMABLE,
  ITEM_TYPE_CONTAINER,
  ITEM_TYPE_ARMOR,
  ITEM_TYPE_SHIELD,
  ITEM_TYPE_WEAPON,
]);

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

export const itemValidator = z.object({
  name: nameValidator,
  bulk: z.number().int(),
  desc: z.string().max(ITEM_MAX),
  type: itemTypeValidator,
  custom_fields: itemFieldsValidator.optional().nullable(),
  uses: usesValidator.optional().nullable().catch(null), // if something in uses is invalid, default to null.
  comment: z.string().max(COMMENT_MAX).optional().nullable(),
  active: z.boolean(),
});

export const partialItemValidator = itemValidator
  .partial()
  .refine((item) => Object.keys(item).length > 0, {
    message: "Partial item is empty",
  });

export const fullItemValidator = itemValidator.extend({
  id: idValidator,
  entity_id: idValidator,
});

export type EntityItemType = z.infer<typeof itemTypeValidator>;
export type UncompleteEntityItem = z.infer<typeof itemValidator>;
export type FullEntityItem = z.infer<typeof fullItemValidator>;
export type EntityItem = UncompleteEntityItem | FullEntityItem;
export type PartialEntityItem = z.infer<typeof partialItemValidator>;
