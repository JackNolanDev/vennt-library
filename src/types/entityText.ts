import { z } from "zod";
import { ENTITY_TEXT_MAX, idValidator } from ".";

export const entityTextKeyValidator = z.enum(["NOTES", "DESC", "BACKSTORY"]);

export const entityTextTextValidator = z.object({
  text: z.string().max(ENTITY_TEXT_MAX),
});

export const entityTextPermissionValidator = z.object({
  public: z.boolean().default(false),
});

export const entityTextValidator = entityTextTextValidator
  .merge(entityTextPermissionValidator)
  .extend({
    key: entityTextKeyValidator,
  });

export const fullEntityTextValidator = entityTextValidator.extend({
  id: idValidator,
  entity_id: idValidator,
});

export type EntityTextKey = z.infer<typeof entityTextKeyValidator>;
export type UncompleteEntityText = z.infer<typeof entityTextValidator>;
export type FullEntityText = z.infer<typeof fullEntityTextValidator>;
