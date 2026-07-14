import {
  CARD_ATTACK_TYPES,
  CARD_EFFECTS,
  CARD_SETS,
  CARD_SINS,
  CARD_TAGS,
  IDENTITY_TAGS,
  TAG_ASSET_IDS,
  TAG_GROUPS,
  SHARED_SPECIAL_CARDS,
  UNIQUE_CARD_TYPES,
  UPGRADE_CARD_SETS
} from "./limbus-data.js";

export const DECK_RULES = {
  deckSize: 20,
  maxCopiesDefault: 2,
  identitySlots: ["front", "back"],
  egoSlots: 1,
  disallowSameSinner: true,
  uniqueCardsCountInDeck: false,
  egoCardsCountInDeck: false
};

export const CARD_TYPES = {
  base: "base",
  identity: "identity",
  identityUnique: "identityUnique",
  identityUpgrade: "identityUpgrade",
  baseUnique: "baseUnique",
  ego: "ego"
};

export function getIdentityId(sinnerId, identityKey) {
  return `${sinnerId}_${identityKey}`;
}

export function getBaseCardId(sinnerId, number) {
  return `${sinnerId}_base_${number}`;
}

export function getBaseUniqueCardId(sinnerId, number) {
  return `${sinnerId}_base_unique_${number}`;
}

export function getIdentityCardId(sinnerId, identityKey, number) {
  return `${getIdentityId(sinnerId, identityKey)}_cards_${number}`;
}

export function getIdentityUniqueCardId(sinnerId, identityKey, number) {
  return `${getIdentityId(sinnerId, identityKey)}_unique_${number}`;
}

export function getIdentityUpgradeCardId(sinnerId, identityKey, number) {
  return `${getIdentityId(sinnerId, identityKey)}_upgrade_${number}`;
}

export function getEgoCardId(sinnerId, egoKey = "base") {
  return `${sinnerId}_${egoKey}_ego`;
}

export function formatImageNumber(number) {
  return String(number).padStart(2, "0");
}

export function getSinnerIconPath(sinnerId) {
  return `assets/sinners/${sinnerId}/icon.png`;
}

export function getIdentityImagePath(sinnerId, identityKey) {
  return `assets/sinners/${sinnerId}/${identityKey}/identity.png`;
}

export function getCardImagePath({ type, sinnerId, identityKey = null, number }) {
  const imageNumber = formatImageNumber(number);

  if (type === CARD_TYPES.base) {
    return `assets/sinners/${sinnerId}/base/${imageNumber}.png`;
  }

  if (type === CARD_TYPES.baseUnique) {
    return `assets/sinners/${sinnerId}/base/unique/${imageNumber}.png`;
  }

  if (type === CARD_TYPES.identity) {
    return `assets/sinners/${sinnerId}/${identityKey}/${imageNumber}.png`;
  }

  if (type === CARD_TYPES.identityUnique) {
    return `assets/sinners/${sinnerId}/${identityKey}/unique/${imageNumber}.png`;
  }

  if (type === CARD_TYPES.identityUpgrade) {
    return `assets/sinners/${sinnerId}/${identityKey}/unique/upgrade/${imageNumber}.png`;
  }

  if (type === CARD_TYPES.ego) {
    return `assets/sinners/${sinnerId}/ego/${identityKey || "base"}.png`;
  }

  return `assets/cards/${sinnerId}_${identityKey || "unknown"}_${number}.png`;
}

export function getTagAssetId(tag, kind = "icon") {
  const assetId = TAG_ASSET_IDS[tag] || tag;
  if (typeof assetId === "string") return assetId;
  return assetId[kind] || assetId.icon || assetId.card || tag;
}

export function getKeywordCardImagePath(tag) {
  return `assets/keywords/cards/${getTagAssetId(tag, "card")}.png`;
}

export function getKeywordIconPath(tag) {
  return `assets/keywords/icons/${getTagAssetId(tag, "icon")}.png`;
}

function addToMapArray(map, key, value) {
  if (!map[key]) map[key] = [];
  map[key].push(value);
}

function makeCard({
  id,
  type,
  sinnerId,
  identityId = null,
  identityKey = null,
  number,
  deckable,
  countsTowardDeck = deckable,
  includedWithSelection = false,
  selectable = deckable,
  maxCopies = deckable ? DECK_RULES.maxCopiesDefault : 0
}) {
  return {
    id,
    type,
    sinnerId,
    identityId,
    identityKey,
    number,
    deckable,
    countsTowardDeck,
    includedWithSelection,
    selectable,
    maxCopies,
    image: getCardImagePath({ type, sinnerId, identityKey, number })
  };
}

function invertTagMap(tagMap) {
  const result = {};

  Object.entries(tagMap).forEach(([tag, ids]) => {
    ids.forEach((id) => {
      addToMapArray(result, id, tag);
    });
  });

  return result;
}

export function buildLimbusData() {
  const sinners = [];
  const identities = [];
  const cards = [];

  const sinnerById = {};
  const identityById = {};
  const cardById = {};
  const egoById = {};
  const egoBySinnerId = {};

  const identitiesBySinnerId = {};
  const baseCardsBySinnerId = {};
  const baseUniqueCardsBySinnerId = {};
  const cardsByIdentityId = {};
  const uniqueCardsByIdentityId = {};
  const upgradeCardsByIdentityId = {};
  const deckableCardsByIdentityId = {};

  const tagsByIdentityId = invertTagMap(IDENTITY_TAGS);
  const tagsByCardId = invertTagMap(CARD_TAGS);
  const effectsByCardId = invertTagMap(CARD_EFFECTS);
  const attackTypesByCardId = invertTagMap(CARD_ATTACK_TYPES);
  const sinByCardId = {};

  Object.entries(CARD_SINS).forEach(([sin, cardIds]) => {
    cardIds.forEach((cardId) => {
      sinByCardId[cardId] = sin;
    });
  });

  function addCard(card) {
    const withTags = {
      ...card,
      tags: tagsByCardId[card.id] || [],
      effects: effectsByCardId[card.id] || [],
      attackType: attackTypesByCardId[card.id]?.[0] || null,
      sin: sinByCardId[card.id] || null
    };

    cards.push(withTags);
    cardById[withTags.id] = withTags;
    return withTags;
  }

  Object.entries(CARD_SETS).forEach(([sinnerId, [baseCount, baseUniqueCount, identitySet]]) => {
    const sinner = {
      id: sinnerId,
      icon: getSinnerIconPath(sinnerId)
    };

    sinners.push(sinner);
    sinnerById[sinnerId] = sinner;
    identitiesBySinnerId[sinnerId] = [];
    baseCardsBySinnerId[sinnerId] = [];
    baseUniqueCardsBySinnerId[sinnerId] = [];

    for (let number = 1; number <= baseCount; number += 1) {
      const card = addCard(makeCard({
        id: getBaseCardId(sinnerId, number),
        type: CARD_TYPES.base,
        sinnerId,
        number,
        deckable: true
      }));

      baseCardsBySinnerId[sinnerId].push(card);
    }

    for (let number = 1; number <= baseUniqueCount; number += 1) {
      const card = addCard(makeCard({
        id: getBaseUniqueCardId(sinnerId, number),
        type: CARD_TYPES.baseUnique,
        sinnerId,
        number,
        deckable: false,
        includedWithSelection: true
      }));

      baseUniqueCardsBySinnerId[sinnerId].push(card);
    }

    const ego = addCard(makeCard({
      id: getEgoCardId(sinnerId, "base"),
      type: CARD_TYPES.ego,
      sinnerId,
      identityKey: "base",
      number: 1,
      deckable: false,
      countsTowardDeck: false,
      includedWithSelection: false,
      selectable: true,
      maxCopies: 1
    }));

    egoById[ego.id] = ego;
    egoBySinnerId[sinnerId] = ego;

    Object.entries(identitySet).forEach(([identityKey, [cardCount, uniqueCount]]) => {
      const identityId = getIdentityId(sinnerId, identityKey);
      const identity = {
        id: identityId,
        sinnerId,
        identityKey,
        image: getIdentityImagePath(sinnerId, identityKey),
        tags: tagsByIdentityId[identityId] || []
      };

      identities.push(identity);
      identityById[identityId] = identity;
      identitiesBySinnerId[sinnerId].push(identity);
      cardsByIdentityId[identityId] = [];
      uniqueCardsByIdentityId[identityId] = [];
      upgradeCardsByIdentityId[identityId] = [];
      deckableCardsByIdentityId[identityId] = [];

      for (let number = 1; number <= cardCount; number += 1) {
        const card = addCard(makeCard({
          id: getIdentityCardId(sinnerId, identityKey, number),
          type: CARD_TYPES.identity,
          sinnerId,
          identityId,
          identityKey,
          number,
          deckable: true
        }));

        cardsByIdentityId[identityId].push(card);
        deckableCardsByIdentityId[identityId].push(card);
      }

      for (let number = 1; number <= uniqueCount; number += 1) {
        const card = addCard(makeCard({
          id: getIdentityUniqueCardId(sinnerId, identityKey, number),
          type: CARD_TYPES.identityUnique,
          sinnerId,
          identityId,
          identityKey,
          number,
          deckable: false,
          includedWithSelection: true
        }));

        uniqueCardsByIdentityId[identityId].push(card);
      }

      const upgradeCount = UPGRADE_CARD_SETS[identityId] || 0;
      for (let number = 1; number <= upgradeCount; number += 1) {
        const card = addCard(makeCard({
          id: getIdentityUpgradeCardId(sinnerId, identityKey, number),
          type: CARD_TYPES.identityUpgrade,
          sinnerId,
          identityId,
          identityKey,
          number,
          deckable: false,
          includedWithSelection: true
        }));

        upgradeCardsByIdentityId[identityId].push(card);
      }
    });
  });

  const deckableCards = cards.filter((card) => card.deckable);
  const uniqueCards = cards.filter((card) => (
    card.type === CARD_TYPES.baseUnique ||
    card.type === CARD_TYPES.identityUnique
  ));
  const upgradeCards = cards.filter((card) => card.type === CARD_TYPES.identityUpgrade);
  const egos = cards.filter((card) => card.type === CARD_TYPES.ego);

  const cardsByTag = Object.fromEntries(
    Object.entries(CARD_TAGS).map(([tag, cardIds]) => [
      tag,
      cardIds.map((cardId) => cardById[cardId]).filter(Boolean)
    ])
  );

  const cardsBySin = Object.fromEntries(
    Object.entries(CARD_SINS).map(([sin, cardIds]) => [
      sin,
      cardIds.map((cardId) => cardById[cardId]).filter(Boolean)
    ])
  );

  const cardsByEffect = Object.fromEntries(
    Object.entries(CARD_EFFECTS).map(([effect, cardIds]) => [
      effect,
      cardIds.map((cardId) => cardById[cardId]).filter(Boolean)
    ])
  );

  const cardsByAttackType = Object.fromEntries(
    Object.entries(CARD_ATTACK_TYPES).map(([attackType, cardIds]) => [
      attackType,
      cardIds.map((cardId) => cardById[cardId]).filter(Boolean)
    ])
  );

  const identitiesByTag = Object.fromEntries(
    Object.entries(IDENTITY_TAGS).map(([tag, identityIds]) => [
      tag,
      identityIds.map((identityId) => identityById[identityId]).filter(Boolean)
    ])
  );

  const keywordAssets = Object.entries(TAG_ASSET_IDS).map(([tag]) => ({
    tag,
    assetId: getTagAssetId(tag, "card"),
    cardImage: getKeywordCardImagePath(tag),
    icon: getKeywordIconPath(tag)
  }));

  return {
    rules: DECK_RULES,
    raw: {
      cardSets: CARD_SETS,
      identityTags: IDENTITY_TAGS,
      cardTags: CARD_TAGS,
      cardEffects: CARD_EFFECTS,
      cardAttackTypes: CARD_ATTACK_TYPES,
      cardSins: CARD_SINS,
      tagAssetIds: TAG_ASSET_IDS,
      tagGroups: TAG_GROUPS,
      uniqueCardTypes: UNIQUE_CARD_TYPES,
      sharedSpecialCards: SHARED_SPECIAL_CARDS,
      upgradeCardSets: UPGRADE_CARD_SETS
    },
    sinners,
    identities,
    cards,
    deckableCards,
    uniqueCards,
    upgradeCards,
    egos,
    sinnerById,
    identityById,
    cardById,
    egoById,
    egoBySinnerId,
    identitiesBySinnerId,
    baseCardsBySinnerId,
    baseUniqueCardsBySinnerId,
    cardsByIdentityId,
    uniqueCardsByIdentityId,
    upgradeCardsByIdentityId,
    deckableCardsByIdentityId,
    identitiesByTag,
    cardsByTag,
    cardsBySin,
    cardsByEffect,
    cardsByAttackType,
    identityIdsByTag: IDENTITY_TAGS,
    cardIdsByTag: CARD_TAGS,
    cardIdsByEffect: CARD_EFFECTS,
    cardIdsByAttackType: CARD_ATTACK_TYPES,
    cardIdsBySin: CARD_SINS,
    uniqueCardTypes: UNIQUE_CARD_TYPES,
    sharedSpecialCards: SHARED_SPECIAL_CARDS,
    keywordAssets,
    tagAssetIds: TAG_ASSET_IDS,
    tagsByIdentityId,
    tagsByCardId,
    effectsByCardId,
    attackTypeByCardId: Object.fromEntries(
      Object.entries(attackTypesByCardId).map(([cardId, attackTypes]) => [cardId, attackTypes[0]])
    ),
    sinByCardId,
    tagGroups: TAG_GROUPS
  };
}

export const LIMBUS_DATA = buildLimbusData();

export function getEligibleEgosForIdentityIds(identityIds, data = LIMBUS_DATA) {
  const sinnerIds = new Set();

  identityIds.forEach((identityId) => {
    const identity = data.identityById[identityId];
    if (!identity) return;
    sinnerIds.add(identity.sinnerId);
  });

  return [...sinnerIds]
    .map((sinnerId) => data.egoBySinnerId[sinnerId])
    .filter(Boolean);
}
