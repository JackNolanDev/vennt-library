import {
  EntityAttributes,
  CollectedEntity,
  EntityAbility,
  EntityItem,
} from "..";

export const buildEntity = (
  attrsOverride?: Partial<EntityAttributes>,
  abilities?: EntityAbility[],
  items?: EntityItem[]
): CollectedEntity => ({
  entity: {
    name: "Test",
    type: "CHARACTER",
    attributes: {
      agi: 0,
      cha: 0,
      dex: 0,
      int: 0,
      per: 0,
      spi: 0,
      str: 3,
      tek: 0,
      wis: 2,
      hp: 10,
      max_hp: 0,
      mp: 5,
      max_mp: 0,
      vim: 15,
      max_vim: 0,
      init: 0,
      speed: 0,
      ...attrsOverride,
    },
    other_fields: {},
    public: false,
  },
  abilities: abilities ?? [],
  items: items ?? [],
  text: [],
  flux: [],
});
