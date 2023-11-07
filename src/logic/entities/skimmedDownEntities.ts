import { CollectedEntity, EntityAbility, EntityItem } from "../..";

export const skimDownAbility = (ability: EntityAbility): EntityAbility => ({
  ...ability,
  effect: "",
  comment: null,
});
export const skimDownItem = (item: EntityItem): EntityItem => ({
  ...item,
  desc: "",
  comment: null,
});

/**
 * Removes all potentially long runs of text from the entity
 * @param entity
 * @returns Skimmed-down entity.
 */
export const skimDownEntity = (entity: CollectedEntity): CollectedEntity => ({
  entity: { ...entity.entity, other_fields: {} },
  abilities: entity.abilities
    .filter((ability) => ability.uses)
    .map(skimDownAbility),
  items: entity.items.filter((item) => item.uses).map(skimDownItem),
  text: [],
  flux: [],
});
