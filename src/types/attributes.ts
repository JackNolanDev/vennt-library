import { z } from "zod";
import {
  ATTRIBUTE_MIN,
  ATTRIBUTE_MAX,
  ATTRIBUTES,
  NAME_MAX,
  CHANGELOG_MAX,
  diceSettingsValidator,
  idValidator,
} from ".";

export const attributeValidator = z
  .number()
  .int()
  .gte(ATTRIBUTE_MIN)
  .lte(ATTRIBUTE_MAX)
  .default(0);
export const combatStatValidator = z.number().int().min(0);
export const baseAttributeFieldValidator = z.enum(ATTRIBUTES);

// NOTE: ALL FUTURE ATTRIBUTES SHOULD BE optional()

export const builtInAttributesValidator = z.object({
  agi: attributeValidator,
  cha: attributeValidator,
  dex: attributeValidator,
  int: attributeValidator,
  per: attributeValidator,
  spi: attributeValidator,
  str: attributeValidator,
  tek: attributeValidator,
  wis: attributeValidator,
  hp: combatStatValidator,
  max_hp: combatStatValidator,
  mp: combatStatValidator,
  max_mp: combatStatValidator,
  vim: combatStatValidator,
  max_vim: combatStatValidator,
  hero: combatStatValidator.optional(),
  max_hero: combatStatValidator.optional(),
  init: z.number().int(),
  speed: z.number().int().min(0),
  xp: z.number().int().optional(),
  sp: z.number().int().optional(),
  armor: z.number().int().optional(),
  burden: z.number().int().optional(),
  casting: z.number().int().optional(),
  l: z.number().int().optional(),
  radius: z.number().optional(),
  reach: z.number().int().optional(),
  shield: z.number().int().optional(),
  bluespace: z.number().int().optional(),
  trii: z.number().int().optional(),
  max_trii: z.number().int().optional(),
  free_hands: z.number().int().optional(),
  carrying_capacity: z.number().int().optional(),
  alerts: z.number().int().optional(),
  max_alerts: z.number().int().optional(),
  recovery_shock: z.number().int().optional(),
  acc: z.number().int().optional(),
  dmg: z.number().int().optional(),
  actions: combatStatValidator.optional(),
  reactions: combatStatValidator.optional(),
  actions_on_turn: z.number().int().optional(),
  reactions_on_turn: z.number().int().optional(),
  heroic_creativity_bonus: z.number().int().optional(),
  // WEAPON SPECIFIC BONUSES
  aggressive_acc: z.number().int().optional(),
  aggressive_dmg: z.number().int().optional(),
  arcane_acc: z.number().int().optional(),
  arcane_dmg: z.number().int().optional(),
  balanced_acc: z.number().int().optional(),
  balanced_dmg: z.number().int().optional(),
  blade_acc: z.number().int().optional(),
  blade_dmg: z.number().int().optional(),
  bow_acc: z.number().int().optional(),
  bow_dmg: z.number().int().optional(),
  brawling_acc: z.number().int().optional(),
  brawling_dmg: z.number().int().optional(),
  brutal_acc: z.number().int().optional(),
  brutal_dmg: z.number().int().optional(),
  cannon_acc: z.number().int().optional(),
  cannon_dmg: z.number().int().optional(),
  great_acc: z.number().int().optional(),
  great_dmg: z.number().int().optional(),
  grenade_acc: z.number().int().optional(),
  grenade_dmg: z.number().int().optional(),
  hookwhip_acc: z.number().int().optional(),
  hookwhip_dmg: z.number().int().optional(),
  improvised_acc: z.number().int().optional(),
  improvised_dmg: z.number().int().optional(),
  polearm_acc: z.number().int().optional(),
  polearm_dmg: z.number().int().optional(),
  protector_acc: z.number().int().optional(),
  protector_dmg: z.number().int().optional(),
  rifle_acc: z.number().int().optional(),
  rifle_dmg: z.number().int().optional(),
  shotgun_acc: z.number().int().optional(),
  shotgun_dmg: z.number().int().optional(),
  sidearm_acc: z.number().int().optional(),
  sidearm_dmg: z.number().int().optional(),
  thrown_acc: z.number().int().optional(),
  thrown_dmg: z.number().int().optional(),
  tinkertech_acc: z.number().int().optional(),
  tinkertech_dmg: z.number().int().optional(),
  unarmed_acc: z.number().int().optional(),
  unarmed_dmg: z.number().int().optional(),
  whip_acc: z.number().int().optional(),
  whip_dmg: z.number().int().optional(),
  // DAMAGE RESISTANCE
  fall_damage_resistance: z.number().int().optional(),
  vim_damage_resistance: z.number().int().optional(),
  burn_damage_resistance: z.number().int().optional(),
  bleed_damage_resistance: z.number().int().optional(),
  stun_damage_resistance: z.number().int().optional(),
  paralysis_damage_resistance: z.number().int().optional(),
  attribute_damage_resistance: z.number().int().optional(),
  galvanic_damage_resistance: z.number().int().optional(),
  magical_damage_resistance: z.number().int().optional(),
  physical_damage_resistance: z.number().int().optional(),
  piercing_damage_resistance: z.number().int().optional(),
  slashing_damage_resistance: z.number().int().optional(),
  bludgeoning_damage_resistance: z.number().int().optional(),
  // SPECIAL DAMAGE
  burning: combatStatValidator.optional(),
  bleeding: combatStatValidator.optional(),
  paralysis: combatStatValidator.optional(),
  stun: combatStatValidator.optional(),
  agi_dmg: combatStatValidator.optional(),
  cha_dmg: combatStatValidator.optional(),
  dex_dmg: combatStatValidator.optional(),
  int_dmg: combatStatValidator.optional(),
  per_dmg: combatStatValidator.optional(),
  spi_dmg: combatStatValidator.optional(),
  str_dmg: combatStatValidator.optional(),
  tek_dmg: combatStatValidator.optional(),
  wis_dmg: combatStatValidator.optional(),
});

export const attributeNameValidator = z
  .string()
  .min(1)
  .max(NAME_MAX)
  .toLowerCase()
  .regex(/^\w+$/u, "Contains no spaces. Use '_' instead.");
export const attributeValValidator = z.number().int();
export const attributesValidator = builtInAttributesValidator.catchall(
  attributeValValidator
);
export const partialAttributesValidator = attributesValidator.partial();

export const validAttributes = Object.keys(
  builtInAttributesValidator.keyof().Values
) as EntityAttribute[];

export const computedAttributeReason = z.object({
  val: z.number().int(),
  src: z.string().max(CHANGELOG_MAX),
  abilityId: idValidator.optional(),
  itemId: idValidator.optional(),
});
export const computedAttributeValidator = z.object({
  base: z.number().int().optional(),
  val: z.number().int(),
  reason: computedAttributeReason.array().optional(),
  dice: diceSettingsValidator.optional(),
});
export const computedAttributesValidator = z.record(
  attributeNameValidator,
  computedAttributeValidator
);

export type EntityAttribute = z.infer<typeof attributeNameValidator>;
export type EntityAttributes = z.infer<typeof attributesValidator>;
export type BaseEntityAttribute = z.infer<typeof baseAttributeFieldValidator>;
export type ComputedAttributeReason = z.infer<typeof computedAttributeReason>;
export type ComputedAttribute = z.infer<typeof computedAttributeValidator>;
export type ComputedAttributes = z.infer<typeof computedAttributesValidator>;
export type PartialEntityAttributes = z.infer<
  typeof partialAttributesValidator
>;

export const optionalComputedAttributesResponseValidator = z.object({
  computed_attributes: computedAttributesValidator.nullable().optional(),
});
export type OptionalComputedAttributesResponse = z.infer<
  typeof optionalComputedAttributesResponseValidator
>;
