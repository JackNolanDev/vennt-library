import { CollectedEntity } from "../..";

/**
 * Removes all potentially long runs of text from the entity
 * @param entity
 * @returns Skimmed-down entity.
 */
export const skimDownEntity = (entity: CollectedEntity): CollectedEntity => ({
  entity: { ...entity.entity, other_fields: {} },
  abilities: entity.abilities
    .filter((ability) => ability.uses)
    .map((ability) => ({ ...ability, effect: "", comment: null })),
  items: entity.items
    .filter((item) => item.uses)
    .map((item) => ({ ...item, desc: "", comment: null })),
  text: [],
  flux: [],
});
