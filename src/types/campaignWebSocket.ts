import { z } from "zod";
import { CHAT_MAX, idValidator } from ".";

export const CONNECTION_AUTHORIZED_MSG = "ok";

export const CHAT_TYPE = "c";
export const SEND_CHAT_TYPE = "cs";
export const REQUEST_CHAT_TYPE = "cr";
export const OLD_CHAT_TYPE = "co";
export const REQUEST_UPDATE_CHAT_TYPE = "cru";
export const UPDATE_CHAT_TYPE = "cu";
export const DELETE_CHAT_TYPE = "cd";

export const sendChatMessageValidator = z.object({
  type: z.literal(SEND_CHAT_TYPE),
  message: z.string().max(CHAT_MAX),
  entity: idValidator.optional(),
  for: idValidator.optional(),
});
export type SendChatMessage = z.infer<typeof sendChatMessageValidator>;

export const chatMessageValidator = sendChatMessageValidator.extend({
  type: z.literal(CHAT_TYPE),
  id: idValidator,
  sender: idValidator,
  time: z.string().datetime(),
  updated: z.string().datetime().optional(),
});
export type ChatMessage = z.infer<typeof chatMessageValidator>;

export const requestOldChatMessagesValidator = z.object({
  type: z.literal(REQUEST_CHAT_TYPE),
  cursor: z.string().max(100), // cursor
});
export type RequestOldChatMessages = z.infer<
  typeof requestOldChatMessagesValidator
>;

export const oldChatMessagesValidator = z.object({
  type: z.literal(OLD_CHAT_TYPE),
  message: z.array(chatMessageValidator).max(100),
  cursor: z.string().max(100).optional(), // cursor to get next page
});
export type OldChatMessages = z.infer<typeof oldChatMessagesValidator>;

export const requestUpdateChatMessageValidator = z.object({
  type: z.literal(REQUEST_UPDATE_CHAT_TYPE),
  id: idValidator, // message ID
  message: z.string().max(CHAT_MAX), // new message
});
export type RequestUpdateChatMessage = z.infer<
  typeof requestUpdateChatMessageValidator
>;

export const updatedChatMessageValidator = z.object({
  type: z.literal(UPDATE_CHAT_TYPE),
  id: idValidator, // message ID
  message: z.string().max(CHAT_MAX), // new message
  updated: z.string().datetime(), // timestamp of message updated
});
export type UpdatedChatMessage = z.infer<typeof updatedChatMessageValidator>;

export const deleteChatMessageValidator = z.object({
  type: z.literal(DELETE_CHAT_TYPE),
  id: idValidator, // message ID
});
export type DeleteChatMessage = z.infer<typeof deleteChatMessageValidator>;

export const campaignWSMessageValidator = z.union([
  sendChatMessageValidator,
  chatMessageValidator,
  requestOldChatMessagesValidator,
  oldChatMessagesValidator,
  requestUpdateChatMessageValidator,
  updatedChatMessageValidator,
  deleteChatMessageValidator,
]);
export type CampaignWSMessage = z.infer<typeof campaignWSMessageValidator>;
