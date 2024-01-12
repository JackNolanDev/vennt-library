import { z } from "zod";
import {
  CHANGELOG_MAX,
  CHARACTER_GIFTS,
  NAME_MAX,
  attributeNameValidator,
  attributesValidator,
  cogCreateOptionsValidator,
  computedAttributesValidator,
  diceSettingsValidator,
  idValidator,
  nameValidator,
} from ".";

export const giftValidator = z.enum(CHARACTER_GIFTS);
export const entityTypeValidator = z.enum(["CHARACTER", "COG"]);

export const disabledActionsValidator = z.record(
  z.string().max(NAME_MAX),
  z.array(
    z.object({
      msg: z.string().max(CHANGELOG_MAX),
      icon: z.string().max(NAME_MAX).optional(),
    })
  )
);

// non-number attributes go here
export const otherAttributesValidator = z.object({
  gift: giftValidator.optional(),
  second_gift: giftValidator.optional(),
  cog_type: z.string().max(NAME_MAX).optional(),
  cog_creation_options: cogCreateOptionsValidator.optional(),
  dice_settings: diceSettingsValidator.optional(),
  attribute_dice_settings: z
    .record(attributeNameValidator, diceSettingsValidator)
    .optional(),
  in_combat: z.boolean().optional(),
  disabled_actions: disabledActionsValidator.optional(),
});

export const entityValidator = z.object({
  name: nameValidator,
  type: entityTypeValidator,
  attributes: attributesValidator,
  other_fields: otherAttributesValidator,
  public: z.boolean().default(false),
});

export const fullEntityValidator = entityValidator.extend({
  id: idValidator,
  owner: idValidator,
  computed_attributes: computedAttributesValidator.optional().nullable(),
});

export const partialEntityValidator = fullEntityValidator
  .omit({ id: true })
  .partial()
  .refine((ability) => Object.keys(ability).length > 0, {
    message: "Partial entity is empty",
  });

export type CharacterGift = z.infer<typeof giftValidator>;
export type EntityType = z.infer<typeof entityTypeValidator>;
export type DisabledActions = z.infer<typeof disabledActionsValidator>;
export type EntityFields = z.infer<typeof otherAttributesValidator>;
export type UncompleteEntity = z.infer<typeof entityValidator>;
export type FullEntity = z.infer<typeof fullEntityValidator>;
export type Entity = UncompleteEntity | FullEntity;
export type PartialEntity = z.infer<typeof partialEntityValidator>;
