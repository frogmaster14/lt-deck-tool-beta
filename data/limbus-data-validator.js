import { LIMBUS_DATA } from "./limbus-data-utils.js";

function addIssue(target, severity, code, message, details = {}) {
  target.push({
    severity,
    code,
    message,
    ...details
  });
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
      return;
    }

    seen.add(value);
  });

  return [...duplicates];
}

export function collectExpectedImages(data = LIMBUS_DATA) {
  return [
    ...data.sinners.map((item) => ({
      kind: "sinner-icon",
      id: item.id,
      image: item.icon
    })),
    ...data.identities.map((item) => ({
      kind: "identity",
      id: item.id,
      image: item.image
    })),
    ...data.cards.map((item) => ({
      kind: item.type,
      id: item.id,
      image: item.image
    })),
    ...data.keywordAssets.map((item) => ({
      kind: "keyword-card",
      id: item.tag,
      image: item.cardImage
    })),
    ...data.keywordAssets.map((item) => ({
      kind: "keyword-icon",
      id: item.tag,
      image: item.icon
    }))
  ];
}

function validateUniqueIds(data, issues) {
  [
    ["sinner", data.sinners.map((item) => item.id)],
    ["identity", data.identities.map((item) => item.id)],
    ["card", data.cards.map((item) => item.id)]
  ].forEach(([kind, ids]) => {
    findDuplicates(ids).forEach((id) => {
      addIssue(issues, "error", "duplicate-id", `${kind} ID가 중복되었습니다: ${id}`, {
        kind,
        id
      });
    });
  });
}

function validateTagRefs(data, issues) {
  Object.entries(data.identityIdsByTag).forEach(([tag, identityIds]) => {
    identityIds.forEach((identityId) => {
      if (data.identityById[identityId]) return;

      addIssue(
        issues,
        "error",
        "missing-identity-tag-ref",
        `인격 태그 "${tag}"가 없는 인격을 참조합니다: ${identityId}`,
        { tag, identityId }
      );
    });
  });

  Object.entries(data.cardIdsByTag).forEach(([tag, cardIds]) => {
    cardIds.forEach((cardId) => {
      if (data.cardById[cardId]) return;

      addIssue(
        issues,
        "error",
        "missing-card-tag-ref",
        `카드 태그 "${tag}"가 없는 카드를 참조합니다: ${cardId}`,
        { tag, cardId }
      );
    });
  });
}

function validateImageRefs(data, issues, imageExists) {
  const expectedImages = collectExpectedImages(data);

  expectedImages.forEach((item) => {
    if (item.image && imageExists(item.image, item)) return;

    addIssue(
      issues,
      "error",
      "missing-image",
      `${item.kind} 이미지가 없습니다: ${item.id} -> ${item.image || "(empty)"}`,
      item
    );
  });
}

export function summarizeIssues(issues) {
  return issues.reduce((summary, issue) => {
    const key = `${issue.severity}:${issue.code}`;
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});
}

export function validateLimbusData({
  data = LIMBUS_DATA,
  imageExists = null
} = {}) {
  const issues = [];

  validateUniqueIds(data, issues);
  validateTagRefs(data, issues);

  if (imageExists) {
    validateImageRefs(data, issues, imageExists);
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const missingImagesByKind = issues
    .filter((issue) => issue.code === "missing-image")
    .reduce((summary, issue) => {
      summary[issue.kind] = (summary[issue.kind] || 0) + 1;
      return summary;
    }, {});

  return {
    ok: errors.length === 0,
    summary: {
      sinners: data.sinners.length,
      identities: data.identities.length,
      cards: data.cards.length,
      deckableCards: data.deckableCards.length,
      uniqueCards: data.uniqueCards.length,
      upgradeCards: data.upgradeCards.length,
      egos: data.egos.length,
      expectedImages: collectExpectedImages(data).length,
      missingImages: issues.filter((issue) => issue.code === "missing-image").length,
      missingImagesByKind,
      issues: issues.length,
      errors: errors.length,
      byCode: summarizeIssues(issues)
    },
    issues
  };
}
