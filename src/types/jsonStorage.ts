import { z } from "zod";
import {
  ITEM_MAX,
  NAME_MAX,
  abilityValidator,
  itemFieldsValidator,
  itemTypeValidator,
  nameValidator,
  usesValidator,
} from ".";

export const WEAPON_TYPES_KEY = "VENNT_WEAPON_TYPES";
export const SHOP_ITEMS_KEY = "VENNT_SHOP_ITEMS";
export const ABILITIES_KEY = "VENNT_ABILITIES";
export const ABILITIES_KEY_OLD = "VENNT_ABILITIES_0.13.7";

export const jsonStorageKeyValidator = z.enum([
  WEAPON_TYPES_KEY,
  SHOP_ITEMS_KEY,
  ABILITIES_KEY,
  ABILITIES_KEY_OLD,
]);

export const pathDetailsValidator = z.object({
  name: z.string(),
  url: z.string().url(),
  desc: z.string(),
  reqs: z.string().optional(),
  completionBonus: z.string().optional(),
});

export const pathsAndAbilitiesValidator = z.object({
  paths: pathDetailsValidator.array(),
  abilities: abilityValidator.array(),
});

export const shopItemValidator = itemFieldsValidator.extend({
  name: nameValidator.optional(),
  bulk: z.number().int(),
  desc: z.string().max(ITEM_MAX),
  type: itemTypeValidator,
  cost: z.string().max(NAME_MAX),
  sp: z.number().int().optional(),
  section: z.string().max(NAME_MAX).optional(),
  examples: z.string().max(ITEM_MAX).optional(),
  uses: usesValidator.optional().nullable().catch(null), // if something in uses is invalid, default to null.
});

export type JsonStorageKey = z.infer<typeof jsonStorageKeyValidator>;
export type ShopItem = z.infer<typeof shopItemValidator>;
export type PathDetails = z.infer<typeof pathDetailsValidator>;
export type PathsAndAbilities = z.infer<typeof pathsAndAbilitiesValidator>;
