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
  t: z.literal(SEND_CHAT_TYPE), // type
  m: z.string().max(CHAT_MAX), // message
  s: idValidator, // sender (user / entity id)
  f: idValidator.optional(), // for (when sending DMs - has to be user id)
});
export type SendChatMessage = z.infer<typeof sendChatMessageValidator>;

export const chatMessageValidator = sendChatMessageValidator.extend({
  t: z.literal(CHAT_TYPE), // type
  id: idValidator, // message ID
  d: z.string().datetime(), // timestamp of message
  u: z.string().datetime().optional(), // timestamp of message updated (if it was updated)
});
export type ChatMessage = z.infer<typeof chatMessageValidator>;

export const requestOldChatMessagesValidator = z.object({
  t: z.literal(REQUEST_CHAT_TYPE),
  c: z.string().max(100), // cursor
});
export type RequestOldChatMessages = z.infer<
  typeof requestOldChatMessagesValidator
>;

export const oldChatMessagesValidator = z.object({
  t: z.literal(OLD_CHAT_TYPE),
  m: z.array(chatMessageValidator).min(1).max(100),
  c: z.string().max(100).optional(), // cursor to get next page
});
export type OldChatMessages = z.infer<typeof oldChatMessagesValidator>;

export const requestUpdateChatMessageValidator = z.object({
  t: z.literal(REQUEST_UPDATE_CHAT_TYPE),
  id: idValidator, // message ID
  m: z.string().max(CHAT_MAX), // new message
});
export type RequestUpdateChatMessage = z.infer<
  typeof requestUpdateChatMessageValidator
>;

export const updatedChatMessageValidator = z.object({
  t: z.literal(UPDATE_CHAT_TYPE),
  id: idValidator, // message ID
  m: z.string().max(CHAT_MAX), // new message
  u: z.string().datetime(), // timestamp of message updated
});
export type UpdatedChatMessage = z.infer<typeof updatedChatMessageValidator>;

export const deleteChatMessageValidator = z.object({
  t: z.literal(DELETE_CHAT_TYPE),
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
