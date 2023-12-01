import { z } from "zod";
import {
  COMMENT_MAX,
  nameValidator,
  idValidator,
  entityTypeValidator,
  attributesValidator,
  otherAttributesValidator,
} from ".";

export const CAMPAIGN_ROLE_SPECTATOR = "SPECTATOR";
export const CAMPAIGN_ROLE_PLAYER = "PLAYER";
export const CAMPAIGN_ROLE_GM = "GM";
export const CAMPAIGN_ROLES = [
  CAMPAIGN_ROLE_SPECTATOR,
  CAMPAIGN_ROLE_PLAYER,
  CAMPAIGN_ROLE_GM,
] as const;
export const campaignRoleValidator = z.enum(CAMPAIGN_ROLES);

export const campaignRoleObjectValidator = z.object({
  role: campaignRoleValidator,
});

export const campaignDescValidator = z.object({
  desc: z.string().max(COMMENT_MAX),
});
export const postCampaignValidator = campaignDescValidator.extend({
  name: nameValidator,
});

export const campaignValidator = postCampaignValidator.extend({
  id: idValidator,
  in_combat: z.boolean(),
  init_index: z.number().int().nonnegative(),
  init_round: z.number().int().nonnegative(),
});

export const campaignWithRoleValidator = campaignValidator.merge(
  campaignRoleObjectValidator
);

export const postCampaignInviteValidator = campaignRoleObjectValidator.extend({
  campaign_id: idValidator,
  to: nameValidator,
});
export const campaignInviteValidator = postCampaignInviteValidator.extend({
  id: idValidator,
  from: nameValidator,
  created: z.string().datetime(),
});
export const campaignInviteWithDetailsValidator =
  campaignInviteValidator.extend({
    name: nameValidator,
    desc: z.string().max(COMMENT_MAX),
  });

export const campaignInviteLinkHashValidator = z.string().length(10);
export const postCampaignInviteLinkValidator = z.object({
  campaign_id: idValidator,
  hash: campaignInviteLinkHashValidator,
  minutes_to_expire: z.number().int().min(1),
});
export const campaignInviteLinkValidator = postCampaignInviteLinkValidator
  .omit({ minutes_to_expire: true })
  .extend({
    id: idValidator,
    expires: z.string().datetime(),
    created: z.string().datetime(),
  });

export const campaignMemberValidator = campaignRoleObjectValidator.extend({
  id: idValidator,
  campaign_id: idValidator,
  account_id: idValidator,
  username: nameValidator,
});

export const postCampaignEntityValidator = z.object({
  entity_id: idValidator,
  gm_only: z.boolean(),
});

export const campaignEntityValidator = postCampaignEntityValidator.extend({
  owner: idValidator,
  name: nameValidator,
  type: entityTypeValidator,
  attributes: attributesValidator,
  other_fields: otherAttributesValidator,
});

export const fullCampaignDetailsValidator = z.object({
  campaign: campaignValidator,
  invites: campaignInviteValidator.array().optional(),
  invite_links: campaignInviteLinkValidator.array().optional(),
  members: campaignMemberValidator.array(),
  entities: campaignEntityValidator.array(),
});

export type CampaignRole = z.infer<typeof campaignRoleValidator>;
export type CampaignDesc = z.infer<typeof campaignDescValidator>;
export type PostCampaign = z.infer<typeof postCampaignValidator>;
export type Campaign = z.infer<typeof campaignValidator>;
export type CampaignWithRole = z.infer<typeof campaignWithRoleValidator>;
export type PostCampaignInvite = z.infer<typeof postCampaignInviteValidator>;
export type CampaignInvite = z.infer<typeof campaignInviteValidator>;
export type CampaignInviteWithDetails = z.infer<
  typeof campaignInviteWithDetailsValidator
>;
export type PostCampaignInviteLink = z.infer<
  typeof postCampaignInviteLinkValidator
>;
export type CampaignInviteLink = z.infer<typeof campaignInviteLinkValidator>;
export type PostCampaignEntity = z.infer<typeof postCampaignEntityValidator>;
export type CampaignMember = z.infer<typeof campaignMemberValidator>;
export type CampaignEntity = z.infer<typeof campaignEntityValidator>;
export type FullCampaignDetails = z.infer<typeof fullCampaignDetailsValidator>;
