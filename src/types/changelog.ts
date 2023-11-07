import { z } from "zod";
import {
  attributeNameValidator,
  CHANGELOG_MAX,
  idValidator,
  partialAttributesValidator,
} from ".";

export const attributeChangelogValidator = z.object({
  attr: attributeNameValidator,
  msg: z.string().max(CHANGELOG_MAX),
  prev: z.number().optional().nullable(),
});

export const fullAttributeChangelogValidator =
  attributeChangelogValidator.extend({
    id: idValidator,
    entity_id: idValidator,
    time: z.string().datetime(),
  });

export const adjustAttributesValidator = z.object({
  message: z.string().max(CHANGELOG_MAX).optional(),
  attributes: partialAttributesValidator.refine(
    (attrs) => Object.keys(attrs).length > 0,
    { message: "Attributes is empty" }
  ),
});

export const filterChangelogValidator = z.object({
  attributes: attributeNameValidator.array(),
});

export type UncompleteEntityChangelog = z.infer<
  typeof attributeChangelogValidator
>;
export type FullEntityChangelog = z.infer<
  typeof fullAttributeChangelogValidator
>;
export type EntityChangelog = UncompleteEntityChangelog | FullEntityChangelog;

export type UpdateEntityAttributes = z.infer<typeof adjustAttributesValidator>;
export type FilterChangelogBody = z.infer<typeof filterChangelogValidator>;
