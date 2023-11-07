import { EntityAttribute } from ".";

export enum DamageType {
  PHYSICAL = "physical",
  MAGICAL = "magical",
  GALVANIC = "galvanic",
  PIERCING = "piercing",
  SLASHING = "slashing",
  BLUDGEONING = "bludgeoning",
  VIM = "vim",
  BURN = "burn",
  BLEED = "bleed",
  STUN = "stun",
  PARALYSIS = "paralysis",
  ATTRIBUTE = "attribute",
  FALL = "fall",
}

export const NORMAL_DAMAGES = [
  DamageType.BLUDGEONING,
  DamageType.GALVANIC,
  DamageType.MAGICAL,
  DamageType.PHYSICAL,
  DamageType.PIERCING,
  DamageType.SLASHING,
];
export const PHYSICAL_SUB_DAMAGES = [
  DamageType.BLUDGEONING,
  DamageType.PIERCING,
  DamageType.SLASHING,
];

export interface AttackDamage {
  damage: number;
  type: DamageType;
  attribute?: EntityAttribute;
}

export interface AttackDetails {
  accuracy: number;
  damages: AttackDamage[];
  numberOfAttacks?: number;
}

export interface AttackResponse {
  alerts: number;
  dodge?: boolean;
  block?: boolean;
  inHolyShield?: boolean;
  hasShieldBlock?: boolean;
  hasImprovedShieldBlock?: boolean;
  hasEnhancedBlock?: boolean;
  hasShieldMaster?: boolean;
  hasDiamondBlock?: boolean;
  hasNotAScratch?: boolean;
}
