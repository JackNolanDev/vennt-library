import { z } from "zod";
import { CHAT_MAX, ENTITY_TEXT_MAX, idValidator } from ".";

export const CONNECTION_AUTHORIZED_MSG = "ok";

export const CHAT_TYPE = "c";
export const SEND_CHAT_TYPE = "cs";
export const REQUEST_CHAT_TYPE = "cr";
export const OLD_CHAT_TYPE = "co";
export const REQUEST_UPDATE_CHAT_TYPE = "cru";
export const UPDATE_CHAT_TYPE = "cu";
export const DELETE_CHAT_TYPE = "cd";

export const REQUEST_DICE_ROLL_TYPE = "dr";
export const DICE_ROLL_RESULT_TYPE = "d";

export const baseWebsocketMessageValidator = z.object({
  request_id: idValidator.optional(),
});

export const storedWebsocketMessageId = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
export const baseStoredWebsocketMessageValidator = z.object({
  id: storedWebsocketMessageId,
  sender: idValidator,
  time: z.string().datetime(),
  updated: z.string().datetime().optional(),
});

export const sendChatMessageValidator = baseWebsocketMessageValidator.extend({
  type: z.literal(SEND_CHAT_TYPE),
  message: z.string().max(CHAT_MAX),
  entity: idValidator.optional(),
  for: idValidator.optional(),
});
export type SendChatMessage = z.infer<typeof sendChatMessageValidator>;

export const chatMessageValidator = sendChatMessageValidator
  .merge(baseStoredWebsocketMessageValidator)
  .extend({
    type: z.literal(CHAT_TYPE),
  });
export type ChatMessage = z.infer<typeof chatMessageValidator>;

export const requestUpdateChatMessageValidator =
  baseWebsocketMessageValidator.extend({
    type: z.literal(REQUEST_UPDATE_CHAT_TYPE),
    id: storedWebsocketMessageId, // message ID
    message: z.string().max(CHAT_MAX), // new message
  });
export type RequestUpdateChatMessage = z.infer<
  typeof requestUpdateChatMessageValidator
>;

export const updatedChatMessageValidator = baseWebsocketMessageValidator.extend(
  {
    type: z.literal(UPDATE_CHAT_TYPE),
    id: storedWebsocketMessageId, // message ID
    message: z.string().max(CHAT_MAX), // new message
    updated: z.string().datetime(), // timestamp of message updated
  }
);
export type UpdatedChatMessage = z.infer<typeof updatedChatMessageValidator>;

export const deleteChatMessageValidator = baseWebsocketMessageValidator.extend({
  type: z.literal(DELETE_CHAT_TYPE),
  id: storedWebsocketMessageId, // message ID
});
export type DeleteChatMessage = z.infer<typeof deleteChatMessageValidator>;

export const requestDiceRollValidator = baseWebsocketMessageValidator.extend({
  type: z.literal(REQUEST_DICE_ROLL_TYPE),
  entity: idValidator.optional(),
  dice: z.string().max(CHAT_MAX),
  message: z.string().max(CHAT_MAX).optional(),
  gm_only: z.literal("t").optional(), // using a string instead of a true boolean to make it simpler to store in the string map
});
export type RequestDiceRoll = z.infer<typeof requestDiceRollValidator>;

export const diceRollResultValidator = requestDiceRollValidator
  .merge(baseStoredWebsocketMessageValidator)
  .extend({
    type: z.literal(DICE_ROLL_RESULT_TYPE),
    result: z.string().max(ENTITY_TEXT_MAX),
  });
export type DiceRollResult = z.infer<typeof diceRollResultValidator>;

export const storedMessageValidator = z.union([
  chatMessageValidator,
  diceRollResultValidator,
]);
export type StoredMessage = z.infer<typeof storedMessageValidator>;

export const requestOldChatMessagesValidator =
  baseWebsocketMessageValidator.extend({
    type: z.literal(REQUEST_CHAT_TYPE),
    cursor: z.string().max(300), // cursor
  });
export type RequestOldChatMessages = z.infer<
  typeof requestOldChatMessagesValidator
>;

export const oldChatMessagesValidator = baseWebsocketMessageValidator.extend({
  type: z.literal(OLD_CHAT_TYPE),
  message: storedMessageValidator.array().max(100),
  cursor: z.string().max(300).optional(), // cursor to get next page
});
export type OldChatMessages = z.infer<typeof oldChatMessagesValidator>;

export const campaignWSMessageValidator = z.union([
  sendChatMessageValidator,
  chatMessageValidator,
  requestOldChatMessagesValidator,
  oldChatMessagesValidator,
  requestUpdateChatMessageValidator,
  updatedChatMessageValidator,
  deleteChatMessageValidator,
  requestDiceRollValidator,
  diceRollResultValidator,
]);
export type CampaignWSMessage = z.infer<typeof campaignWSMessageValidator>;
