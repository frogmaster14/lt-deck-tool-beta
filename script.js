const LIMBUS_DATA = window.LIMBUS_DATA;
const DECK_LIMIT = 20;
const APP_VERSION = "2.0.2.1 beta";
const ENABLED_BETA_VIEWS = new Set(["codex", "feedback"]);
const FEEDBACK_DRAFT_KEY = "limttak_feedback_draft";

const menuCopy = {
  deck: {
    title: "덱 만들기",
    copy: "전방/후방 인격을 고르고, 카드 20장과 EGO를 구성하는 작업 화면으로 이동합니다."
  },
  codex: {
    title: "도감",
    copy: "수감자, 인격, 카드, 키워드, 공용 추가 카드를 한곳에서 확인하는 화면입니다."
  },
  saves: {
    title: "저장 목록",
    copy: "브라우저에 저장한 덱을 다시 열거나 공유용 코드로 내보내는 화면입니다."
  },
  guide: {
    title: "이용 방법",
    copy: "전방/후방 선택, EGO 규칙, 덱 장수, 스택/상태 카드 처리 방식을 정리합니다."
  },
  feedback: {
    title: "피드백",
    copy: "누락 이미지, 잘못된 키워드 분류, 카드 태그 제안을 모으는 입구입니다."
  }
};

Object.assign(menuCopy.deck, {
  copy: "베타 배포에서는 잠시 닫아둡니다. 이번 공개판은 도감 확인과 피드백 수집 먼저 진행합니다."
});
Object.assign(menuCopy.codex, {
  copy: "이번 베타에서 사용 가능한 핵심 기능입니다. 카드, EGO, 스택/상태, 필터를 확인합니다."
});
Object.assign(menuCopy.saves, {
  copy: "아직 준비 중입니다. 덱 저장과 공유는 덱 만들기 기능이 안정화된 뒤 열 예정입니다."
});
Object.assign(menuCopy.guide, {
  copy: "아직 준비 중입니다. 베타 기간에는 도감과 피드백 화면만 먼저 사용합니다."
});
Object.assign(menuCopy.feedback, {
  copy: "누락 이미지, 필터 오류, 카드 누락, UI 불편을 정해진 양식으로 복사해 제보합니다."
});

const buttons = document.querySelectorAll(".menu-button");
const archiveList = document.querySelector("#archive-list");
const selectedTitle = document.querySelector("#selected-title");
const selectedCopy = document.querySelector("#selected-copy");
const archiveCopyElement = document.querySelector("#archive-copy");
const developerNote = document.querySelector("#developer-note");
const noticeTitle = document.querySelector("#notice-title");
const noticeState = document.querySelector("#notice-state");
const currentVersion = document.querySelector("#current-version");
const currentSummary = document.querySelector("#current-summary");
const homeView = document.querySelector("#home-view");
const builderView = document.querySelector("#builder-view");
const deckView = document.querySelector("#deck-view");
const codexView = document.querySelector("#codex-view");
const feedbackView = document.querySelector("#feedback-view");
const identityGrid = document.querySelector("#identity-grid");
const identityCount = document.querySelector("#identity-count");
const sinnerFilterButtons = document.querySelector("#sinner-filter-buttons");
const keywordFilterButtons = document.querySelector("#keyword-filter-buttons");
const keywordSpecialFilterButtons = document.querySelector("#keyword-special-filter-buttons");
const identitySlots = document.querySelectorAll(".identity-slot");
const slotExtras = document.querySelectorAll(".slot-extra");
const identityPreview = document.querySelector("#identity-preview");
const swapSlotButton = document.querySelector("[data-action='swap-slots']");
const nextStepButton = document.querySelector("[data-action='next-step']");
const deckSideSummary = document.querySelector("#deck-side-summary");
const deckCardTabs = document.querySelector("#deck-card-tabs");
const deckCardPool = document.querySelector("#deck-card-pool");
const deckIncludedGrid = document.querySelector("#deck-included-grid");
const deckExtraGrid = document.querySelector("#deck-extra-grid");
const deckCount = document.querySelector("#deck-view .deck-count");
const deckPreview = document.querySelector("#deck-preview");
const deckKeywordFilters = document.querySelector("#deck-keyword-filters");
const deckSpecialKeywordFilters = document.querySelector("#deck-special-keyword-filters");
const deckSinFilters = document.querySelector("#deck-sin-filters");
const deckAttackTypeFilters = document.querySelector("#deck-attack-type-filters");
const deckEffectFilters = document.querySelector("#deck-effect-filters");
const codexTabs = document.querySelector("#codex-tabs");
const codexGrid = document.querySelector("#codex-grid");
const codexCount = document.querySelector("#codex-count");
const codexHeading = document.querySelector("#codex-heading");
const codexPreview = document.querySelector("#codex-preview");
const codexSinnerFilters = document.querySelector("#codex-sinner-filters");
const codexKeywordFilters = document.querySelector("#codex-keyword-filters");
const codexSpecialKeywordFilters = document.querySelector("#codex-special-keyword-filters");
const codexSinFilters = document.querySelector("#codex-sin-filters");
const codexAttackTypeFilters = document.querySelector("#codex-attack-type-filters");
const codexEffectFilters = document.querySelector("#codex-effect-filters");
const codexPreviewFilters = document.querySelector("#codex-preview-filters");
const feedbackForm = document.querySelector("#feedback-form");
const feedbackTarget = document.querySelector("#feedback-target");
const feedbackDetail = document.querySelector("#feedback-detail");
const feedbackDeviceOptions = document.querySelectorAll("[name='device']");
const feedbackOutput = document.querySelector("#feedback-output");
const feedbackStatus = document.querySelector("#feedback-status");

const deckCardTabsData = [
  ["all", "전체"],
  ["sinner", "수감자"],
  ["identity", "인격"],
  ["ego", "EGO"],
  ["upgrade", "강화"]
];
const sinFilters = [
  { label: "분노", image: "assets/sins/icons/wrath.png" },
  { label: "색욕", image: "assets/sins/icons/lust.png" },
  { label: "나태", image: "assets/sins/icons/sloth.png" },
  { label: "탐식", image: "assets/sins/icons/gluttony.png" },
  { label: "우울", image: "assets/sins/icons/gloom.png" },
  { label: "오만", image: "assets/sins/icons/pride.png" },
  { label: "질투", image: "assets/sins/icons/envy.png" }
];
const effectFilterGroups = [
  {
    title: "회복",
    filters: [
      { label: "가드회복", image: "assets/effects/icons/guard_restore.png" },
      { label: "체력회복", image: "assets/effects/icons/hp_restore.png" }
    ]
  },
  {
    title: "카드 이동",
    filters: [
      { label: "드로우", image: "assets/effects/icons/draw.png" },
      { label: "버리기", image: "assets/effects/icons/discard.png" },
      { label: "덱 섞기", image: "assets/effects/icons/deck_shuffle.png" },
      { label: "체인 관련", image: "assets/effects/icons/chain_related.png" }
    ]
  },
  {
    title: "특수",
    filters: [
      { label: "필중", image: "assets/effects/icons/sure_hit.png" },
      { label: "코인토스", image: "assets/effects/icons/chain_continue.png" },
      { label: "재사용", image: "assets/effects/icons/reuse.png" },
      { label: "죄악 변경", image: "assets/effects/icons/sin_change.png" },
      { label: "상태 변경", image: "assets/effects/icons/status_change.png" },
      { label: "수감자 교체", image: "assets/effects/icons/sinner_switch.png" },
      { label: "다른 카드로 취급", image: "assets/effects/icons/treated_as_other_card.png" },
      { label: "자해기믹", image: "assets/effects/icons/self_damage.png" }
    ]
  },
  {
    title: "데미지 & 위력",
    filters: [
      { label: "위력증가", image: "assets/effects/icons/power_up.png" },
      { label: "위력감소", image: "assets/effects/icons/opponent_power_down.png" },
      { label: "최대 합 위력 변경", image: "assets/effects/icons/max_clash_power_change.png" },
      { label: "전체 데미지 증가", image: "assets/effects/icons/hp_damage_up.png" },
      { label: "가드뎀 증가", image: "assets/effects/icons/guard_damage_up.png" },
      { label: "체력뎀 증가", image: "assets/effects/icons/damage_up.png" },
      { label: "효과 데미지", image: "assets/effects/icons/effect_damage.png" },
      { label: "상대 데미지 감소", image: "assets/effects/icons/opponent_damage_down.png" },
      { label: "받는 데미지 감소", image: "assets/effects/icons/damage_reduce.png" }
    ]
  }
];
const effectFilters = effectFilterGroups.flatMap((group) => group.filters);
const attackTypeFilters = [
  { label: "참격", image: "assets/attack-types/icons/slash.png" },
  { label: "관통", image: "assets/attack-types/icons/pierce.png" },
  { label: "타격", image: "assets/attack-types/icons/blunt.png" },
  { label: "스킬", image: "assets/attack-types/icons/skill.png" }
];
const specialKeywordTags = new Set([
  "못",
  "마비",
  "투.식.",
  "조리 중",
  "산나비+죽은나비",
  "찢어진 추억",
  "진동폭발",
  "축제의 열기"
]);
const codexTabsData = [
  ["all", "전체"],
  ["identity", "인격"],
  ["card", "카드"],
  ["ego", "EGO"],
  ["stack", "스택", "assets/card-types/icons/stack.png"],
  ["status", "상태", "assets/card-types/icons/status.png"],
  ["upgrade", "강화"],
  ["keyword", "키워드"]
];
const cardCategoryFilters = {
  stack: { label: "스택", image: "assets/card-types/icons/stack.png" },
  status: { label: "상태", image: "assets/card-types/icons/status.png" }
};

const versionHistory = window.VERSION_HISTORY || [];
const builderState = {
  activeSlot: "front",
  selected: {
    front: null,
    back: null
  },
  hovered: null,
  activeSinners: [],
  activeTags: [],
  activeDeckTab: "all",
  activeDeckTags: [],
  activeDeckSins: [],
  activeDeckAttackTypes: [],
  activeDeckEffects: [],
  deckCards: [],
  selectedEgo: null,
  upgradeCards: []
};
const codexState = {
  activeTab: "all",
  activeSinners: [],
  activeTags: [],
  activeSins: [],
  activeAttackTypes: [],
  activeEffects: [],
  previewItemId: ""
};

function removeNativeTooltips(root = document) {
  const titledElements = [];

  if (root.nodeType === Node.ELEMENT_NODE && root.hasAttribute("title")) {
    titledElements.push(root);
  }

  root.querySelectorAll?.("[title]").forEach((element) => {
    titledElements.push(element);
  });

  titledElements.forEach((element) => {
    element.removeAttribute("title");
  });
}

function setupImageInteractionGuards() {
  const imageSelector = [
    "img",
    ".preview-frame",
    ".identity-card",
    ".codex-item",
    ".deck-pool-card",
    ".deck-included-card",
    ".deck-extra-card",
    ".deck-side-image",
    ".slot-token",
    ".deck-token"
  ].join(",");

  removeNativeTooltips();

  document.addEventListener("pointerover", (event) => {
    const titledElement = event.target.closest?.("[title]");
    if (titledElement) titledElement.removeAttribute("title");
  }, true);

  document.addEventListener("focusin", (event) => {
    const titledElement = event.target.closest?.("[title]");
    if (titledElement) titledElement.removeAttribute("title");
  }, true);

  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest?.(imageSelector)) event.preventDefault();
  }, true);

  document.addEventListener("dragstart", (event) => {
    if (event.target.closest?.("img")) event.preventDefault();
  }, true);

  const tooltipObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        removeNativeTooltips(mutation.target);
        return;
      }

      mutation.addedNodes.forEach((node) => {
        removeNativeTooltips(node);
      });
    });
  });

  tooltipObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["title"],
    childList: true,
    subtree: true
  });
}

setupImageInteractionGuards();

buttons.forEach((button) => {
  button.classList.toggle("is-locked", !ENABLED_BETA_VIEWS.has(button.dataset.view));
  button.classList.remove("primary");
});

const defaultMenuButton = document.querySelector("[data-view='codex']");
if (defaultMenuButton) {
  defaultMenuButton.classList.add("primary", "is-selected");
  selectedTitle.textContent = menuCopy.codex.title;
  selectedCopy.textContent = menuCopy.codex.copy;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    const detail = menuCopy[view];
    if (!detail) return;

    buttons.forEach((item) => {
      item.classList.remove("is-selected");
      item.classList.remove("primary");
    });

    button.classList.add("is-selected");
    selectedTitle.textContent = detail.title;
    selectedCopy.textContent = detail.copy;
  });

  button.addEventListener("dblclick", () => {
    if (!ENABLED_BETA_VIEWS.has(button.dataset.view)) return;

    if (button.dataset.action === "open-builder") {
      openBuilder();
    }

    if (button.dataset.view === "codex") {
      openCodex();
    }

    if (button.dataset.view === "feedback") {
      openFeedback();
    }
  });
});

function renderVersion(version) {
  if (!version) return;

  archiveCopyElement.textContent = version.copy;
  noticeTitle.textContent = "개발자 노트";

  if (!version.developerNote) {
    noticeState.textContent = "대기중";
    developerNote.classList.add("is-empty");
    developerNote.textContent = "큰 기능 업데이트 때만 개발자 노트 표시.";
    return;
  }

  noticeState.textContent = version.label;
  developerNote.classList.remove("is-empty");
  developerNote.innerHTML = `
    <h3>${version.developerNote.title}</h3>
    ${version.developerNote.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
  `;
}

function renderArchive() {
  if (!versionHistory.length) return;

  const latest = versionHistory[0];
  currentVersion.textContent = latest.label;
  currentSummary.textContent = latest.summary;

  archiveList.innerHTML = versionHistory.map((version, index) => `
    <button class="archive-item ${index === 0 ? "is-selected" : ""}" type="button" data-version="${version.version}">
      <span>${version.label}</span>
      <small>${version.summary}</small>
    </button>
  `).join("");

  renderVersion(latest);
}

renderArchive();

archiveList.addEventListener("click", (event) => {
  const button = event.target.closest(".archive-item");
  if (!button) return;

  const version = versionHistory.find((item) => item.version === button.dataset.version);
  if (!version) return;

  archiveList.querySelectorAll(".archive-item").forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
  renderVersion(version);
});

document.querySelector("[data-action='back-home']").addEventListener("click", () => {
  showView("home");
});

document.querySelector("[data-action='reset-identities']").addEventListener("click", () => {
  builderState.selected.front = null;
  builderState.selected.back = null;
  builderState.activeSlot = "front";
  builderState.hovered = null;
  resetDeckState();
  renderBuilder();
});

document.querySelector("[data-action='back-builder']").addEventListener("click", () => {
  showView("builder");
});

document.querySelector("[data-action='back-home-codex']").addEventListener("click", () => {
  showView("home");
});

document.querySelector("[data-action='back-home-feedback']").addEventListener("click", () => {
  showView("home");
});

document.querySelector("[data-action='reset-codex']").addEventListener("click", () => {
  resetCodexState();
  renderCodex();
});

document.querySelector("[data-action='reset-feedback']").addEventListener("click", () => {
  resetFeedbackForm();
});

document.querySelector("[data-action='copy-feedback']").addEventListener("click", async () => {
  await copyFeedbackText();
});

document.querySelector("[data-action='save-feedback-draft']").addEventListener("click", () => {
  saveFeedbackDraft();
});

feedbackForm?.addEventListener("input", renderFeedbackOutput);

document.querySelector("[data-action='reset-deck']").addEventListener("click", () => {
  resetDeckState();
  renderDeckBuilder();
});

swapSlotButton.addEventListener("click", () => {
  if (!builderState.selected.front && !builderState.selected.back) return;

  [builderState.selected.front, builderState.selected.back] = [builderState.selected.back, builderState.selected.front];
  builderState.hovered = builderState.selected[builderState.activeSlot]
    || builderState.selected.front
    || builderState.selected.back
    || null;
  renderBuilder();
});

nextStepButton.addEventListener("click", () => {
  if (!builderState.selected.front || !builderState.selected.back) return;

  showView("deck");
  renderDeckBuilder();
});

identitySlots.forEach((slot) => {
  slot.addEventListener("click", () => {
    builderState.activeSlot = slot.dataset.slot;
    const identity = getIdentity(builderState.selected[slot.dataset.slot]);
    if (identity) builderState.hovered = identity.id;

    renderSlots();
    renderIdentities();
    renderPreview(builderState.hovered);
  });

  const showSlotPreview = () => {
    const identity = getIdentity(builderState.selected[slot.dataset.slot]);
    if (!identity) return;

    builderState.hovered = identity.id;
    renderPreview(identity.id);
  };

  slot.addEventListener("mouseenter", showSlotPreview);
  slot.addEventListener("mouseover", showSlotPreview);
  slot.addEventListener("pointerenter", showSlotPreview);
  slot.addEventListener("focus", showSlotPreview);
});

function showView(viewName) {
  const isHome = viewName === "home";
  const isBuilder = viewName === "builder";
  const isDeck = viewName === "deck";
  const isCodex = viewName === "codex";
  const isFeedback = viewName === "feedback";

  homeView.hidden = !isHome;
  builderView.hidden = !isBuilder;
  deckView.hidden = !isDeck;
  codexView.hidden = !isCodex;
  feedbackView.hidden = !isFeedback;
  homeView.classList.toggle("is-active", isHome);
  builderView.classList.toggle("is-active", isBuilder);
  deckView.classList.toggle("is-active", isDeck);
  codexView.classList.toggle("is-active", isCodex);
  feedbackView.classList.toggle("is-active", isFeedback);
}

function openBuilder() {
  showView("builder");
  renderBuilder();
}

function openCodex() {
  showView("codex");
  renderCodex();
}

function openFeedback() {
  showView("feedback");
  loadFeedbackDraft();
  prefillFeedbackTargetFromCodex();
  renderFeedbackOutput();
}

function getActiveCodexFilterSummary() {
  const sections = [
    ["수감자", codexState.activeSinners],
    ["키워드", codexState.activeTags],
    ["죄악", codexState.activeSins],
    ["유형", codexState.activeAttackTypes],
    ["기타", codexState.activeEffects]
  ];

  const activeSections = sections
    .filter(([, values]) => values.length)
    .map(([label, values]) => `${label}: ${values.join(", ")}`);

  return activeSections.length ? activeSections.join(" / ") : "없음";
}

function getFeedbackData() {
  return {
    target: feedbackTarget?.value.trim() || "",
    detail: feedbackDetail?.value.trim() || "",
    device: getSelectedFeedbackDevice()
  };
}

function getSelectedFeedbackDevice() {
  return Array.from(feedbackDeviceOptions).find((option) => option.checked)?.value || "PC";
}

function buildFeedbackText() {
  const data = getFeedbackData();
  return [
    "[림.딱 빌더 베타 피드백]",
    `버전: ${APP_VERSION}`,
    `환경: ${data.device}`,
    `대상: ${data.target || "미입력"}`,
    `도감 필터: ${getActiveCodexFilterSummary()}`,
    `내용:`,
    data.detail || "미입력"
  ].join("\n");
}

function renderFeedbackOutput() {
  if (!feedbackOutput) return;
  feedbackOutput.textContent = buildFeedbackText();
}

function setFeedbackStatus(message, isError = false) {
  if (!feedbackStatus) return;

  feedbackStatus.textContent = message;
  feedbackStatus.classList.toggle("is-error", isError);
}

function prefillFeedbackTargetFromCodex() {
  if (!feedbackTarget || feedbackTarget.value.trim() || !codexState.previewItemId) return;

  feedbackTarget.value = codexState.previewItemId;
}

function resetFeedbackForm() {
  feedbackForm?.reset();
  localStorage.removeItem(FEEDBACK_DRAFT_KEY);
  setFeedbackStatus("입력 내용 비움.");
  prefillFeedbackTargetFromCodex();
  renderFeedbackOutput();
}

function saveFeedbackDraft() {
  localStorage.setItem(FEEDBACK_DRAFT_KEY, JSON.stringify(getFeedbackData()));
  setFeedbackStatus("임시 저장됨.");
  renderFeedbackOutput();
}

function loadFeedbackDraft() {
  const rawDraft = localStorage.getItem(FEEDBACK_DRAFT_KEY);
  if (!rawDraft) return;

  try {
    const draft = JSON.parse(rawDraft);
    if (feedbackTarget) feedbackTarget.value = draft.target || "";
    if (feedbackDetail) feedbackDetail.value = draft.detail || "";
    feedbackDeviceOptions.forEach((option) => {
      option.checked = option.value === (draft.device || "PC");
    });
    setFeedbackStatus("임시 저장된 내용 불러옴.");
  } catch {
    localStorage.removeItem(FEEDBACK_DRAFT_KEY);
  }
}

async function copyFeedbackText() {
  const text = buildFeedbackText();
  renderFeedbackOutput();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(feedbackOutput);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }

    setFeedbackStatus("피드백 내용 복사됨.");
  } catch {
    setFeedbackStatus("자동 복사 실패. 오른쪽 내용을 직접 복사해줘.", true);
  }
}

function renderCodex() {
  renderCodexFilters();
  renderCodexTabs();
  renderCodexGrid();
  renderCodexPreview(null);
}

function renderCodexFilters() {
  codexEffectFilters.classList.add("effect-filter-groups");

  codexSinnerFilters.innerHTML = LIMBUS_DATA.sinners.map((sinner) => `
    <button
      class="deck-filter-token codex-preview-source ${codexState.activeSinners.includes(sinner.id) ? "is-active" : ""}"
      type="button"
      title="${sinner.id}"
      data-codex-sinner="${sinner.id}"
      data-preview-image="${sinner.icon}"
      data-preview-alt="${sinner.id}"
    >
      <img src="${sinner.icon}" alt="" />
    </button>
  `).join("");

  const keywordFilters = getKeywordFilterSets(LIMBUS_DATA.cardTagFilters || LIMBUS_DATA.identityTagFilters);
  codexKeywordFilters.innerHTML = renderKeywordFilterButtons(keywordFilters.normal, codexState.activeTags, {
    buttonClass: "deck-filter-token codex-preview-source",
    dataAttribute: "data-codex-tag",
    preview: true
  });
  codexSpecialKeywordFilters.innerHTML = renderKeywordFilterButtons(keywordFilters.special, codexState.activeTags, {
    buttonClass: "deck-filter-token codex-preview-source",
    dataAttribute: "data-codex-tag",
    preview: true
  });
  syncSpecialKeywordPanel(codexSpecialKeywordFilters, keywordFilters.special, codexState.activeTags);

  codexSinFilters.innerHTML = sinFilters.map((filter) => `
    <button
      class="deck-filter-token ${codexState.activeSins.includes(filter.label) ? "is-active" : ""}"
      type="button"
      title="${filter.label}"
      data-codex-sin="${filter.label}"
    >
      <img src="${filter.image}" alt="" />
    </button>
  `).join("");

  codexAttackTypeFilters.innerHTML = attackTypeFilters.map((filter) => `
    <button
      class="deck-filter-token ${codexState.activeAttackTypes.includes(filter.label) ? "is-active" : ""}"
      type="button"
      title="${filter.label}"
      data-codex-attack-type="${filter.label}"
    >
      <img src="${filter.image}" alt="" onerror="this.hidden=true;" />
    </button>
  `).join("");

  codexEffectFilters.innerHTML = renderEffectFilterGroups(codexState.activeEffects, "codex");

  codexSinnerFilters.querySelectorAll("[data-codex-sinner]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeSinners", button.dataset.codexSinner));
  });

  codexKeywordFilters.querySelectorAll("[data-codex-tag]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeTags", button.dataset.codexTag));
  });

  codexSpecialKeywordFilters.querySelectorAll("[data-codex-tag]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeTags", button.dataset.codexTag));
  });

  codexSinFilters.querySelectorAll("[data-codex-sin]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeSins", button.dataset.codexSin));
  });

  codexAttackTypeFilters.querySelectorAll("[data-codex-attack-type]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeAttackTypes", button.dataset.codexAttackType));
  });

  codexEffectFilters.querySelectorAll("[data-codex-effect]").forEach((button) => {
    button.addEventListener("click", () => toggleCodexFilter("activeEffects", button.dataset.codexEffect));
  });

  attachCodexPreviewListeners(codexSinnerFilters);
  attachCodexPreviewListeners(codexKeywordFilters);
  attachCodexPreviewListeners(codexSpecialKeywordFilters);
}

function toggleCodexFilter(key, value) {
  codexState[key] = codexState[key].includes(value)
    ? codexState[key].filter((item) => item !== value)
    : [...codexState[key], value];

  renderCodexFilters();
  renderCodexGrid();
}

function renderCodexTabs() {
  codexTabs.innerHTML = codexTabsData.map(([tabId, label, image]) => `
    <button
      class="deck-bookmark ${codexState.activeTab === tabId ? "is-active" : ""}"
      type="button"
      data-codex-tab="${tabId}"
    >
      ${renderBookmarkContent(label, image)}
    </button>
  `).join("");

  codexTabs.querySelectorAll("[data-codex-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      codexState.activeTab = button.dataset.codexTab;
      renderCodexTabs();
      renderCodexGrid();
    });
  });
}

function renderCodexGrid() {
  const items = getFilteredCodexItems();
  const activeTab = codexTabsData.find(([tabId]) => tabId === codexState.activeTab);
  codexHeading.textContent = activeTab?.[1] || "전체";
  codexCount.textContent = String(items.length);

  if (!items.length) {
    codexGrid.innerHTML = `<div class="deck-empty-note">해당 항목 없음.</div>`;
    return;
  }

  codexGrid.innerHTML = items.map((item) => `
    <button
      class="codex-item codex-preview-source ${item.shape === "icon" ? "is-icon" : ""}"
      type="button"
      title="${item.title}"
      data-codex-item-id="${item.id}"
      data-preview-image="${item.previewImage || item.image}"
      data-preview-alt="${item.title}"
    >
      <img src="${item.image}" alt="" onerror="this.closest('button').hidden=true;" />
    </button>
  `).join("");

  attachCodexPreviewListeners(codexGrid);
}

function getFilteredCodexItems() {
  return getCodexItems().filter((item) => {
    const tabMatched = codexState.activeTab === "all" || item.category === codexState.activeTab;
    const sinnerMatched = !codexState.activeSinners.length
      || (item.sinnerId && codexState.activeSinners.includes(item.sinnerId));
    const hasCoreFilters = codexState.activeSinners.length
      || codexState.activeSins.length
      || codexState.activeAttackTypes.length;
    const hasOptionalFilters = codexState.activeTags.length
      || codexState.activeEffects.length;
    const tagMatched = codexState.activeTags.length
      && item.tags.some((tag) => codexState.activeTags.includes(tag));
    const sinMatched = codexState.activeSins.length
      && codexState.activeSins.includes(item.sin);
    const attackTypeMatched = codexState.activeAttackTypes.length
      && codexState.activeAttackTypes.includes(item.attackType);
    const effectMatched = codexState.activeEffects.length
      && item.effects.some((effect) => codexState.activeEffects.includes(effect));

    const coreMatched = sinnerMatched
      && (!codexState.activeSins.length || sinMatched)
      && (!codexState.activeAttackTypes.length || attackTypeMatched);
    const optionalMatched = !hasOptionalFilters || tagMatched || effectMatched;
    const hasAnyFilter = hasCoreFilters || hasOptionalFilters;
    const showItem = !hasAnyFilter || (item.category !== "keyword" && coreMatched && optionalMatched);

    return tabMatched && showItem;
  });
}

function getCodexItems() {
  const items = [];

  LIMBUS_DATA.sinners.forEach((sinner) => {
    const [baseCount, baseUniqueCount, identitySet] = LIMBUS_DATA.raw.cardSets[sinner.id];

    for (let index = 1; index <= baseCount; index += 1) {
      const id = `${sinner.id}_base_${index}`;
      items.push(makeCodexItem({
        id,
        category: "card",
        sinnerId: sinner.id,
        image: `assets/sinners/${sinner.id}/base/${padNumber(index)}.png`
      }));
    }

    for (let index = 1; index <= baseUniqueCount; index += 1) {
      const id = `${sinner.id}_base_unique_${index}`;
      items.push(makeCodexItem({
        id,
        category: getUniqueCardCategory(id),
        sinnerId: sinner.id,
        image: `assets/sinners/${sinner.id}/base/unique/${padNumber(index)}.png`
      }));
    }

    items.push(makeCodexItem({
      id: `${sinner.id}_base_ego`,
      category: "ego",
      sinnerId: sinner.id,
      image: `assets/sinners/${sinner.id}/ego/base.png`
    }));

    Object.entries(identitySet).forEach(([identityKey, [cardCount]]) => {
      const identityId = `${sinner.id}_${identityKey}`;
      const identity = getIdentity(identityId);
      if (!identity) return;

      items.push({
        id: identity.id,
        title: identity.id,
        category: "identity",
        sinnerId: identity.sinnerId,
        image: identity.image,
        tags: identity.tags,
        effects: getCardEffects(identity.id),
        sin: null,
        attackType: null,
        shape: "card"
      });

      for (let index = 1; index <= cardCount; index += 1) {
        const id = `${identity.id}_cards_${index}`;
        items.push(makeCodexItem({
          id,
          category: "card",
          sinnerId: identity.sinnerId,
          image: `assets/sinners/${identity.sinnerId}/${identity.identityKey}/${padNumber(index)}.png`
        }));
      }

      identity.uniqueCards.forEach((card) => {
        items.push(makeCodexItem({
          id: card.id,
          category: getUniqueCardCategory(card.id),
          sinnerId: identity.sinnerId,
          image: card.image
        }));
      });

      identity.upgradeCards.forEach((card) => {
        items.push(makeCodexItem({
          id: card.id,
          category: "upgrade",
          sinnerId: identity.sinnerId,
          image: card.image
        }));
      });
    });
  });

  (LIMBUS_DATA.sharedSpecialCards || LIMBUS_DATA.raw?.sharedSpecialCards || []).forEach((card) => {
    items.push({
      id: card.id,
      title: card.title,
      category: card.category,
      sinnerId: card.sinnerId,
      image: card.image,
      previewImage: card.previewImage || card.image,
      tags: card.tags || [],
      effects: card.effects || [],
      sin: null,
      attackType: null,
      shape: "card"
    });
  });

  const keywordFilters = LIMBUS_DATA.cardTagFilters || LIMBUS_DATA.identityTagFilters;
  keywordFilters.forEach((filter) => {
    items.push({
      id: `keyword_${filter.tag}`,
      title: filter.tag,
      category: "keyword",
      image: filter.cardImage,
      previewImage: filter.cardImage,
      sinnerId: null,
      tags: [filter.tag],
      effects: [],
      sin: null,
      attackType: null,
      shape: "card"
    });
  });

  return items;
}

function renderEffectFilterGroups(activeEffects, target) {
  const dataAttribute = target === "codex" ? "data-codex-effect" : "data-deck-effect";

  return effectFilterGroups.map((group) => `
    <div class="filter-subgroup">
      <p class="filter-subgroup-title">${group.title}</p>
      <div class="deck-filter-buttons">
        ${group.filters.map((filter) => renderEffectFilterButton(filter, activeEffects, dataAttribute)).join("")}
      </div>
    </div>
  `).join("");
}

function renderEffectFilterButton(filter, activeEffects, dataAttribute) {
  const content = filter.image
    ? `<img src="${filter.image}" alt="" onerror="this.hidden=true;" />`
    : `<span class="filter-token-empty" aria-hidden="true"></span>`;

  return `
    <button
      class="deck-filter-token ${activeEffects.includes(filter.label) ? "is-active" : ""}"
      type="button"
      title="${filter.label}"
      aria-label="${filter.label}"
      ${dataAttribute}="${filter.label}"
    >
      ${content}
    </button>
  `;
}

function getKeywordFilterSets(keywordFilters) {
  return {
    normal: keywordFilters.filter((filter) => !specialKeywordTags.has(filter.tag)),
    special: keywordFilters.filter((filter) => specialKeywordTags.has(filter.tag))
  };
}

function renderKeywordFilterButtons(filters, activeTags, {
  buttonClass,
  dataAttribute,
  preview = false
}) {
  return filters.map((filter) => {
    const previewAttributes = preview
      ? `data-preview-image="${filter.cardImage}" data-preview-alt="${filter.tag}"`
      : "";

    return `
      <button
        class="${buttonClass} ${activeTags.includes(filter.tag) ? "is-active" : ""}"
        type="button"
        title="${filter.tag}"
        ${dataAttribute}="${filter.tag}"
        ${previewAttributes}
      >
        <img src="${filter.image}" alt="${filter.tag}" />
      </button>
    `;
  }).join("");
}

function syncSpecialKeywordPanel(container, filters, activeTags) {
  const panel = container?.closest(".special-keyword-panel");
  if (!panel) return;

  panel.hidden = !filters.length;
  if (!filters.length) {
    panel.open = false;
    return;
  }

  if (activeTags.some((tag) => specialKeywordTags.has(tag))) {
    panel.open = true;
  }
}

function makeCodexItem({ id, category, sinnerId, image }) {
  return {
    id,
    title: id,
    category,
    sinnerId,
    image,
    tags: getCardTags(id),
    effects: getCardEffects(id),
    sin: getCardSin(id),
    attackType: getCardAttackType(id),
    shape: "card"
  };
}

function getUniqueCardCategory(cardId) {
  return LIMBUS_DATA.uniqueCardTypes?.[cardId]
    || LIMBUS_DATA.raw?.uniqueCardTypes?.[cardId]
    || "status";
}

function resetCodexState() {
  codexState.activeTab = "all";
  codexState.activeSinners = [];
  codexState.activeTags = [];
  codexState.activeSins = [];
  codexState.activeAttackTypes = [];
  codexState.activeEffects = [];
  codexState.previewItemId = "";
}

function attachCodexPreviewListeners(root) {
  root.querySelectorAll(".codex-preview-source").forEach((button) => {
    const showPreview = () => {
      const codexItem = button.dataset.codexItemId
        ? getCodexItems().find((item) => item.id === button.dataset.codexItemId)
        : null;

      if (codexItem) codexState.previewItemId = codexItem.id;

      renderCodexPreview({
        image: button.dataset.previewImage,
        alt: button.dataset.previewAlt,
        filters: codexItem ? getCodexPreviewFilters(codexItem) : []
      });
    };

    button.addEventListener("mouseenter", showPreview);
    button.addEventListener("mouseover", showPreview);
    button.addEventListener("pointerenter", showPreview);
    button.addEventListener("focus", showPreview);
    button.addEventListener("click", showPreview);
  });
}

function renderCodexPreview(item) {
  if (!item) {
    codexPreview.innerHTML = "<span>항목에 마우스를 올리면 크게 표시.</span>";
    renderCodexPreviewFilters([]);
    return;
  }

  codexPreview.innerHTML = `<img src="${item.image}" alt="${item.alt}" />`;
  renderCodexPreviewFilters(item.filters);
}

function renderCodexPreviewFilters(filters = []) {
  if (!codexPreviewFilters) return;

  codexPreviewFilters.innerHTML = filters.map((filter) => `
    <span
      class="codex-preview-filter codex-preview-filter-${filter.type}"
      title="${filter.label}"
      aria-label="${filter.label}"
    >
      <img src="${filter.image}" alt="" onerror="this.hidden=true;" />
    </span>
  `).join("");
}

function getCodexPreviewFilters(item) {
  const filters = [];
  const sinner = item.sinnerId ? LIMBUS_DATA.sinnerById[item.sinnerId] : null;

  if (sinner) {
    filters.push({
      type: "sinner",
      label: item.sinnerId,
      image: sinner.icon
    });
  }

  const categoryFilter = cardCategoryFilters[item.category];
  if (categoryFilter) {
    filters.push({
      type: "card-category",
      label: categoryFilter.label,
      image: categoryFilter.image
    });
  }

  if (item.sin) {
    const sinFilter = sinFilters.find((filter) => filter.label === item.sin);
    if (sinFilter) {
      filters.push({
        type: "sin",
        label: item.sin,
        image: sinFilter.image
      });
    }
  }

  if (item.attackType) {
    const attackTypeFilter = attackTypeFilters.find((filter) => filter.label === item.attackType);
    if (attackTypeFilter) {
      filters.push({
        type: "attack",
        label: item.attackType,
        image: attackTypeFilter.image
      });
    }
  }

  item.tags.forEach((tag) => {
    const keywordFilter = getKeywordFilter(tag);
    if (!keywordFilter) return;

    filters.push({
      type: "keyword",
      label: tag,
      image: keywordFilter.image
    });
  });

  item.effects.forEach((effect) => {
    const effectFilter = effectFilters.find((filter) => filter.label === effect);
    if (!effectFilter?.image) return;

    filters.push({
      type: "effect",
      label: effect,
      image: effectFilter.image
    });
  });

  return filters;
}

function getKeywordFilter(tag) {
  const keywordFilters = [
    ...(LIMBUS_DATA.cardTagFilters || []),
    ...(LIMBUS_DATA.identityTagFilters || [])
  ];

  return keywordFilters.find((filter) => filter.tag === tag);
}

function getIdentity(identityId) {
  return identityId ? LIMBUS_DATA.identityById[identityId] : null;
}

function getSelectedSlotForSinner(sinnerId) {
  return Object.entries(builderState.selected).find(([, identityId]) => {
    const identity = getIdentity(identityId);
    return identity?.sinnerId === sinnerId;
  })?.[0] || null;
}

function chooseIdentity(identityId) {
  const identity = getIdentity(identityId);
  if (!identity) return;

  const activeIdentity = getIdentity(builderState.selected[builderState.activeSlot]);
  if (activeIdentity?.id === identity.id) {
    builderState.selected[builderState.activeSlot] = null;
    builderState.hovered = null;
    resetDeckState();
    renderBuilder();
    return;
  }

  const sameSinnerSlot = getSelectedSlotForSinner(identity.sinnerId);
  if (sameSinnerSlot && sameSinnerSlot !== builderState.activeSlot) {
    builderState.selected[sameSinnerSlot] = null;
  }

  builderState.selected[builderState.activeSlot] = identity.id;
  builderState.hovered = identity.id;
  resetDeckState();
  renderBuilder();
}

function renderBuilder() {
  renderFilters();
  renderSlots();
  renderIdentities();
  renderPreview(builderState.hovered);
  updateNextStepButton();
}

function updateNextStepButton() {
  if (!nextStepButton) return;

  const canProceed = Boolean(builderState.selected.front && builderState.selected.back);
  const canSwap = Boolean(builderState.selected.front || builderState.selected.back);
  if (swapSlotButton) swapSlotButton.disabled = !canSwap;
  nextStepButton.disabled = !canProceed;
  nextStepButton.textContent = canProceed ? "다음" : "전방/후방 선택 필요";
}

function renderFilters() {
  sinnerFilterButtons.innerHTML = LIMBUS_DATA.sinners.map((sinner) => {
    const isActive = builderState.activeSinners.includes(sinner.id);

    return `
      <button
        class="filter-button ${isActive ? "is-active" : ""}"
        type="button"
        title="${sinner.id}"
        data-filter-sinner="${sinner.id}"
      >
        <img src="${sinner.icon}" alt="${sinner.id}" />
      </button>
    `;
  }).join("");

  const keywordFilters = getKeywordFilterSets(LIMBUS_DATA.identityTagFilters);
  keywordFilterButtons.innerHTML = renderKeywordFilterButtons(keywordFilters.normal, builderState.activeTags, {
    buttonClass: "filter-button",
    dataAttribute: "data-filter-tag"
  });
  keywordSpecialFilterButtons.innerHTML = renderKeywordFilterButtons(keywordFilters.special, builderState.activeTags, {
    buttonClass: "filter-button",
    dataAttribute: "data-filter-tag"
  });
  syncSpecialKeywordPanel(keywordSpecialFilterButtons, keywordFilters.special, builderState.activeTags);

  sinnerFilterButtons.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSinnerFilter(button.dataset.filterSinner);
    });
  });

  keywordFilterButtons.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleTagFilter(button.dataset.filterTag);
    });
  });

  keywordSpecialFilterButtons.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleTagFilter(button.dataset.filterTag);
    });
  });
}

function toggleSinnerFilter(sinnerId) {
  builderState.activeSinners = builderState.activeSinners.includes(sinnerId)
    ? builderState.activeSinners.filter((activeSinner) => activeSinner !== sinnerId)
    : [...builderState.activeSinners, sinnerId];

  renderFilters();
  renderIdentities();
}

function toggleTagFilter(tag) {
  builderState.activeTags = builderState.activeTags.includes(tag)
    ? builderState.activeTags.filter((activeTag) => activeTag !== tag)
    : [...builderState.activeTags, tag];

  renderFilters();
  renderIdentities();
}

function renderSlots() {
  identitySlots.forEach((slot) => {
    const slotName = slot.dataset.slot;
    const identity = getIdentity(builderState.selected[slotName]);
    const slotBox = slot.closest(".slot-box");
    const slotExtra = [...slotExtras].find((extra) => extra.dataset.slotExtra === slotName);

    slotBox.classList.toggle("is-active", builderState.activeSlot === slotName);
    slot.classList.toggle("is-active", builderState.activeSlot === slotName);
    slot.classList.toggle("has-identity", Boolean(identity));

    if (!identity) {
      slot.innerHTML = `
        <span class="slot-empty">인격 선택</span>
      `;
      slotExtra.innerHTML = "";
      return;
    }

    slot.innerHTML = `
      <img class="slot-image" src="${identity.image}" alt="${identity.id}" />
    `;
    slotExtra.innerHTML = renderSlotExtra(identity);
  });

  attachSlotExtraPreviewListeners();
}

function renderSlotExtra(identity) {
  const keywordButtons = identity.tagIcons.map((tagIcon) => `
    <button
      class="slot-token slot-keyword"
      type="button"
      title="${tagIcon.tag}"
      data-preview-type="image"
      data-preview-image="${tagIcon.cardImage}"
      data-preview-alt="${tagIcon.tag}"
    >
      <img src="${tagIcon.image}" alt="${tagIcon.tag}" />
    </button>
  `).join("");

  const uniqueButtons = identity.uniqueCards.map((card) => `
    <button
      class="slot-token slot-unique-card"
      type="button"
      title="${card.id}"
      data-preview-type="image"
      data-preview-image="${card.image}"
      data-preview-alt="${card.id}"
    >
      <img src="${card.image}" alt="${card.id}" />
    </button>
  `).join("");

  if (!keywordButtons && !uniqueButtons) return "";

  return `
    ${uniqueButtons ? `
      <div class="slot-extra-group">
        <span class="slot-extra-label">스택/상태</span>
        <div class="slot-extra-row" aria-label="스택/상태 카드">${uniqueButtons}</div>
      </div>
    ` : ""}
    ${keywordButtons ? `
      <div class="slot-extra-group">
        <span class="slot-extra-label">키워드</span>
        <div class="slot-extra-row" aria-label="키워드">${keywordButtons}</div>
      </div>
    ` : ""}
  `;
}

function attachSlotExtraPreviewListeners() {
  document.querySelectorAll(".slot-token").forEach((button) => {
    const showPreview = () => {
      builderState.hovered = {
        image: button.dataset.previewImage,
        alt: button.dataset.previewAlt
      };
      renderPreview(builderState.hovered);
    };

    button.addEventListener("mouseenter", showPreview);
    button.addEventListener("mouseover", showPreview);
    button.addEventListener("pointerenter", showPreview);
    button.addEventListener("focus", showPreview);
    button.addEventListener("click", showPreview);
  });
}

function renderIdentities() {
  const visibleIdentities = getVisibleIdentities();
  if (identityCount) identityCount.textContent = visibleIdentities.length;
  identityGrid.innerHTML = visibleIdentities.map((identity) => {
    const selectedSlot = Object.entries(builderState.selected)
      .find(([, identityId]) => identityId === identity.id)?.[0];
    const sameSinnerSlot = getSelectedSlotForSinner(identity.sinnerId);
    const isRelated = Boolean(sameSinnerSlot && sameSinnerSlot !== selectedSlot);

    return `
      <button
        class="identity-card ${selectedSlot ? "is-selected" : ""} ${isRelated ? "is-related" : ""}"
        type="button"
        data-identity-id="${identity.id}"
        aria-label="${identity.id}"
      >
        <img src="${identity.image}" alt="" />
      </button>
    `;
  }).join("");

  identityGrid.querySelectorAll(".identity-card").forEach((card) => {
    card.addEventListener("click", () => chooseIdentity(card.dataset.identityId));
    card.addEventListener("mouseenter", () => {
      builderState.hovered = card.dataset.identityId;
      renderPreview(builderState.hovered);
    });
    card.addEventListener("focus", () => {
      builderState.hovered = card.dataset.identityId;
      renderPreview(builderState.hovered);
    });
  });
}

function getVisibleIdentities() {
  const sinnerFiltered = builderState.activeSinners.length
    ? LIMBUS_DATA.identities.filter((identity) => builderState.activeSinners.includes(identity.sinnerId))
    : LIMBUS_DATA.identities;

  if (!builderState.activeTags.length) return sinnerFiltered;

  return sinnerFiltered.filter((identity) => {
    return builderState.activeTags.some((tag) => identity.tags.includes(tag));
  });
}

function renderDeckBuilder() {
  syncDeckCardsWithAvailableCards();
  renderDeckSideSummary();
  renderDeckFilters();
  renderDeckTabs();
  renderDeckCardPool();
  renderDeckIncludedGrid();
  renderDeckExtraGrid();
  renderDeckPreview(null);
}

function renderDeckSideSummary() {
  deckSideSummary.innerHTML = ["front", "back"].map((slotName) => {
    const identity = getIdentity(builderState.selected[slotName]);
    const label = slotName === "front" ? "전방" : "후방";

    if (!identity) {
      return `
        <article class="deck-side-card">
          <div class="deck-side-empty">${label}</div>
          <div class="deck-side-body">
            <span class="deck-side-label">${label}</span>
            <span class="slot-empty">인격 선택</span>
          </div>
        </article>
      `;
    }

    return `
      <article class="deck-side-card">
        <button
          class="deck-side-image deck-preview-source"
          type="button"
          data-preview-image="${identity.image}"
          data-preview-alt="${identity.id}"
        >
          <img src="${identity.image}" alt="${identity.id}" />
        </button>
        <div class="deck-side-body">
          <span class="deck-side-label">${label}</span>
          <div class="deck-side-assets">
            ${renderDeckAssetRow(identity.uniqueCards.map((card) => ({
              title: card.id,
              image: card.image,
              previewImage: card.image,
              className: "deck-unique-token"
            })))}
            ${renderDeckAssetRow(identity.tagIcons.map((tagIcon) => ({
              title: tagIcon.tag,
              image: tagIcon.image,
              previewImage: tagIcon.cardImage,
              className: "deck-keyword-token"
            })))}
          </div>
        </div>
      </article>
    `;
  }).join("");

  attachDeckPreviewListeners(deckSideSummary);
}

function renderDeckAssetRow(items) {
  if (!items.length) return "";

  return `
    <div class="deck-side-asset-row">
      ${items.map((item) => `
        <button
          class="deck-token ${item.className} deck-preview-source"
          type="button"
          title="${item.title}"
          data-preview-image="${item.previewImage}"
          data-preview-alt="${item.title}"
        >
          <img src="${item.image}" alt="${item.title}" />
        </button>
      `).join("")}
    </div>
  `;
}

function renderDeckFilters() {
  deckEffectFilters.classList.add("effect-filter-groups");

  const keywordFilters = getKeywordFilterSets(LIMBUS_DATA.cardTagFilters || LIMBUS_DATA.identityTagFilters);
  deckKeywordFilters.innerHTML = renderKeywordFilterButtons(keywordFilters.normal, builderState.activeDeckTags, {
    buttonClass: "deck-filter-token deck-preview-source",
    dataAttribute: "data-deck-keyword",
    preview: true
  });
  deckSpecialKeywordFilters.innerHTML = renderKeywordFilterButtons(keywordFilters.special, builderState.activeDeckTags, {
    buttonClass: "deck-filter-token deck-preview-source",
    dataAttribute: "data-deck-keyword",
    preview: true
  });
  syncSpecialKeywordPanel(deckSpecialKeywordFilters, keywordFilters.special, builderState.activeDeckTags);

  deckSinFilters.innerHTML = sinFilters.map((filter) => `
    <button
      class="deck-filter-token ${builderState.activeDeckSins.includes(filter.label) ? "is-active" : ""}"
      type="button"
      title="${filter.label}"
      data-deck-sin="${filter.label}"
    >
      <img src="${filter.image}" alt="${filter.label}" />
    </button>
  `).join("");

  deckAttackTypeFilters.innerHTML = attackTypeFilters.map((filter) => `
    <button
      class="deck-filter-token ${builderState.activeDeckAttackTypes.includes(filter.label) ? "is-active" : ""}"
      type="button"
      title="${filter.label}"
      data-deck-attack-type="${filter.label}"
    >
      <img src="${filter.image}" alt="" onerror="this.hidden=true;" />
    </button>
  `).join("");

  deckEffectFilters.innerHTML = renderEffectFilterGroups(builderState.activeDeckEffects, "deck");

  deckKeywordFilters.querySelectorAll("[data-deck-keyword]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckKeywordFilter(button.dataset.deckKeyword));
  });

  deckSpecialKeywordFilters.querySelectorAll("[data-deck-keyword]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckKeywordFilter(button.dataset.deckKeyword));
  });

  deckSinFilters.querySelectorAll("[data-deck-sin]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckSinFilter(button.dataset.deckSin));
  });

  deckAttackTypeFilters.querySelectorAll("[data-deck-attack-type]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckAttackTypeFilter(button.dataset.deckAttackType));
  });

  deckEffectFilters.querySelectorAll("[data-deck-effect]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckEffectFilter(button.dataset.deckEffect));
  });

  attachDeckPreviewListeners(deckKeywordFilters);
  attachDeckPreviewListeners(deckSpecialKeywordFilters);
}

function toggleDeckKeywordFilter(tag) {
  builderState.activeDeckTags = builderState.activeDeckTags.includes(tag)
    ? builderState.activeDeckTags.filter((activeTag) => activeTag !== tag)
    : [...builderState.activeDeckTags, tag];

  renderDeckFilters();
  renderDeckCardPool();
}

function toggleDeckAttackTypeFilter(attackType) {
  builderState.activeDeckAttackTypes = builderState.activeDeckAttackTypes.includes(attackType)
    ? builderState.activeDeckAttackTypes.filter((activeAttackType) => activeAttackType !== attackType)
    : [...builderState.activeDeckAttackTypes, attackType];

  renderDeckFilters();
  renderDeckCardPool();
}

function toggleDeckEffectFilter(effect) {
  builderState.activeDeckEffects = builderState.activeDeckEffects.includes(effect)
    ? builderState.activeDeckEffects.filter((activeEffect) => activeEffect !== effect)
    : [...builderState.activeDeckEffects, effect];

  renderDeckFilters();
  renderDeckCardPool();
}

function toggleDeckSinFilter(sin) {
  builderState.activeDeckSins = builderState.activeDeckSins.includes(sin)
    ? builderState.activeDeckSins.filter((activeSin) => activeSin !== sin)
    : [...builderState.activeDeckSins, sin];

  renderDeckFilters();
  renderDeckCardPool();
}

function renderDeckTabs() {
  deckCardTabs.innerHTML = deckCardTabsData.map(([tabId, label, image]) => `
    <button
      class="deck-bookmark ${builderState.activeDeckTab === tabId ? "is-active" : ""}"
      type="button"
      data-deck-tab="${tabId}"
    >
      ${renderBookmarkContent(label, image)}
    </button>
  `).join("");

  deckCardTabs.querySelectorAll(".deck-bookmark").forEach((button) => {
    button.addEventListener("click", () => {
      builderState.activeDeckTab = button.dataset.deckTab;
      renderDeckTabs();
      renderDeckCardPool();
    });
  });
}

function renderBookmarkContent(label, image) {
  return `
    ${image ? `<img src="${image}" alt="" onerror="this.hidden=true;" />` : ""}
    <span>${label}</span>
  `;
}

function renderDeckCardPool() {
  const cards = getFilteredDeckCards();

  if (!cards.length) {
    deckCardPool.innerHTML = `<div class="deck-empty-note">해당 카드 없음.</div>`;
    return;
  }

  deckCardPool.innerHTML = cards.map((card) => {
    const isAdded = isDeckCardSelected(card);

    return `
    <button
      class="deck-pool-card deck-preview-source ${isAdded ? "is-added" : ""} ${card.selectable ? "" : "is-disabled"}"
      type="button"
      title="${card.id}"
      data-deck-card-id="${card.id}"
      data-preview-image="${card.image}"
      data-preview-alt="${card.id}"
    >
      <img src="${card.image}" alt="${card.id}" />
    </button>
  `;
  }).join("");

  attachDeckPreviewListeners(deckCardPool);
  deckCardPool.querySelectorAll("[data-deck-card-id]").forEach((button) => {
    button.addEventListener("click", () => toggleDeckCard(button.dataset.deckCardId));
  });
}

function getDeckCards() {
  const selectedIdentities = [getIdentity(builderState.selected.front), getIdentity(builderState.selected.back)]
    .filter(Boolean);
  const cards = [];

  selectedIdentities.forEach((identity) => {
    const baseCount = LIMBUS_DATA.raw.cardSets[identity.sinnerId]?.[0] || 0;

    for (let index = 1; index <= baseCount; index += 1) {
      const id = `${identity.sinnerId}_base_${index}`;
      cards.push({
        id,
        category: "sinner",
        image: `assets/sinners/${identity.sinnerId}/base/${padNumber(index)}.png`,
        selectable: true,
        countsTowardDeck: true,
        sin: getCardSin(id),
        attackType: getCardAttackType(id),
        effects: getCardEffects(id),
        tags: getCardTags(id)
      });
    }

    for (let index = 1; index <= identity.cardCount; index += 1) {
      const id = `${identity.id}_cards_${index}`;
      cards.push({
        id,
        category: "identity",
        image: `assets/sinners/${identity.sinnerId}/${identity.identityKey}/${padNumber(index)}.png`,
        selectable: true,
        countsTowardDeck: true,
        sin: getCardSin(id),
        attackType: getCardAttackType(id),
        effects: getCardEffects(id),
        tags: getCardTags(id)
      });
    }

    identity.upgradeCards.forEach((card) => {
      cards.push({
        id: card.id,
        category: "upgrade",
        image: card.image,
        selectable: true,
        countsTowardDeck: false,
        sin: getCardSin(card.id),
        attackType: getCardAttackType(card.id),
        effects: getCardEffects(card.id),
        tags: getCardTags(card.id)
      });
    });

    const egoId = `${identity.sinnerId}_base_ego`;
    cards.push({
      id: egoId,
      category: "ego",
      image: `assets/sinners/${identity.sinnerId}/ego/base.png`,
      selectable: true,
      countsTowardDeck: false,
      sin: getCardSin(egoId),
      attackType: getCardAttackType(egoId),
      effects: getCardEffects(egoId),
      tags: getCardTags(egoId)
    });
  });

  return cards;
}

function renderDeckIncludedGrid() {
  const availableCards = getDeckCardMap();
  const selectedCards = builderState.deckCards.map((cardId) => availableCards.get(cardId)).filter(Boolean);
  if (deckCount) deckCount.textContent = `${selectedCards.length} / ${DECK_LIMIT}`;

  deckIncludedGrid.innerHTML = Array.from({ length: 20 }, (_, index) => `
    ${selectedCards[index] ? renderDeckIncludedSlot(selectedCards[index], index) : renderDeckEmptySlot(index)}
  `).join("");

  attachDeckPreviewListeners(deckIncludedGrid);
  deckIncludedGrid.querySelectorAll("[data-remove-deck-card]").forEach((button) => {
    button.addEventListener("click", () => removeDeckCard(button.dataset.removeDeckCard));
  });
}

function renderDeckExtraGrid() {
  if (!deckExtraGrid) return;

  const availableCards = getDeckCardMap();
  const selectedEgo = builderState.selectedEgo ? availableCards.get(builderState.selectedEgo) : null;
  const selectedUpgrades = builderState.upgradeCards
    .map((cardId) => availableCards.get(cardId))
    .filter(Boolean);
  const availableUpgrades = Array.from(availableCards.values()).filter((card) => card.category === "upgrade");

  deckExtraGrid.innerHTML = `
    <section class="deck-extra-group">
      <div class="deck-extra-heading">
        <span>EGO</span>
        <small>1장 선택</small>
      </div>
      <div class="deck-extra-card-row">
        ${selectedEgo ? renderDeckExtraCard(selectedEgo) : `<div class="deck-extra-slot">선택 없음</div>`}
      </div>
    </section>
    <section class="deck-extra-group">
      <div class="deck-extra-heading">
        <span>강화</span>
        <small>${selectedUpgrades.length} / ${availableUpgrades.length}</small>
      </div>
      <div class="deck-extra-card-row">
        ${selectedUpgrades.length
          ? selectedUpgrades.map((card) => renderDeckExtraCard(card)).join("")
          : `<div class="deck-extra-slot">${availableUpgrades.length ? "선택 없음" : "해당 없음"}</div>`}
      </div>
    </section>
  `;

  attachDeckPreviewListeners(deckExtraGrid);
  deckExtraGrid.querySelectorAll("[data-remove-extra-card]").forEach((button) => {
    button.addEventListener("click", () => removeDeckExtraCard(button.dataset.removeExtraCard));
  });
}

function renderDeckExtraCard(card) {
  return `
    <button
      class="deck-extra-card deck-preview-source"
      type="button"
      title="${card.id}"
      data-remove-extra-card="${card.id}"
      data-preview-image="${card.image}"
      data-preview-alt="${card.id}"
    >
      <img src="${card.image}" alt="${card.id}" />
    </button>
  `;
}

function renderDeckIncludedSlot(card, index) {
  return `
    <div class="deck-included-slot is-filled">
      <button
        class="deck-included-card deck-preview-source"
        type="button"
        title="${card.id}"
        data-remove-deck-card="${card.id}"
        data-preview-image="${card.image}"
        data-preview-alt="${card.id}"
      >
        <span>${String(index + 1).padStart(2, "0")}</span>
        <img src="${card.image}" alt="${card.id}" />
      </button>
    </div>
  `;
}

function renderDeckEmptySlot(index) {
  return `<div class="deck-included-slot">${String(index + 1).padStart(2, "0")}</div>`;
}

function getFilteredDeckCards() {
  return getDeckCards().filter((card) => {
    const tabMatched = builderState.activeDeckTab === "all" || card.category === builderState.activeDeckTab;
    const hasOptionalFilters = builderState.activeDeckTags.length
      || builderState.activeDeckEffects.length;
    const tagMatched = builderState.activeDeckTags.length
      && card.tags.some((tag) => builderState.activeDeckTags.includes(tag));
    const sinMatched = builderState.activeDeckSins.length
      && builderState.activeDeckSins.includes(card.sin);
    const attackTypeMatched = builderState.activeDeckAttackTypes.length
      && builderState.activeDeckAttackTypes.includes(card.attackType);
    const effectMatched = builderState.activeDeckEffects.length
      && card.effects.some((effect) => builderState.activeDeckEffects.includes(effect));

    const coreMatched = (!builderState.activeDeckSins.length || sinMatched)
      && (!builderState.activeDeckAttackTypes.length || attackTypeMatched);
    const optionalMatched = !hasOptionalFilters || tagMatched || effectMatched;

    return tabMatched && coreMatched && optionalMatched;
  });
}

function getDeckCardMap() {
  return new Map(getDeckCards().map((card) => [card.id, card]));
}

function getCardTags(cardId) {
  return LIMBUS_DATA.tagsByCardId?.[cardId] || [];
}

function getCardSin(cardId) {
  return LIMBUS_DATA.sinByCardId?.[cardId] || null;
}

function getCardAttackType(cardId) {
  return LIMBUS_DATA.attackTypeByCardId?.[cardId] || null;
}

function getCardEffects(cardId) {
  return LIMBUS_DATA.effectsByCardId?.[cardId] || [];
}

function toggleDeckCard(cardId) {
  const card = getDeckCardMap().get(cardId);
  if (!card || !card.selectable) return;

  if (!card.countsTowardDeck) {
    toggleDeckExtraCard(card);
    return;
  }

  if (builderState.deckCards.includes(cardId)) {
    removeDeckCard(cardId);
    return;
  }

  if (builderState.deckCards.length >= DECK_LIMIT) return;

  builderState.deckCards = [...builderState.deckCards, cardId];
  renderDeckCardPool();
  renderDeckIncludedGrid();
}

function removeDeckCard(cardId) {
  builderState.deckCards = builderState.deckCards.filter((activeCardId) => activeCardId !== cardId);
  renderDeckCardPool();
  renderDeckIncludedGrid();
}

function toggleDeckExtraCard(card) {
  if (card.category === "ego") {
    builderState.selectedEgo = builderState.selectedEgo === card.id ? null : card.id;
  }

  if (card.category === "upgrade") {
    builderState.upgradeCards = builderState.upgradeCards.includes(card.id)
      ? builderState.upgradeCards.filter((cardId) => cardId !== card.id)
      : [...builderState.upgradeCards, card.id];
  }

  renderDeckCardPool();
  renderDeckExtraGrid();
}

function removeDeckExtraCard(cardId) {
  if (builderState.selectedEgo === cardId) builderState.selectedEgo = null;
  builderState.upgradeCards = builderState.upgradeCards.filter((activeCardId) => activeCardId !== cardId);
  renderDeckCardPool();
  renderDeckExtraGrid();
}

function isDeckCardSelected(card) {
  if (card.category === "ego") return builderState.selectedEgo === card.id;
  if (card.category === "upgrade") return builderState.upgradeCards.includes(card.id);
  return builderState.deckCards.includes(card.id);
}

function syncDeckCardsWithAvailableCards() {
  const availableCards = getDeckCardMap();
  builderState.deckCards = builderState.deckCards.filter((cardId) => availableCards.has(cardId));
  if (builderState.selectedEgo && !availableCards.has(builderState.selectedEgo)) builderState.selectedEgo = null;
  builderState.upgradeCards = builderState.upgradeCards.filter((cardId) => availableCards.has(cardId));
}

function resetDeckState() {
  builderState.activeDeckTab = "all";
  builderState.activeDeckTags = [];
  builderState.activeDeckSins = [];
  builderState.activeDeckAttackTypes = [];
  builderState.activeDeckEffects = [];
  builderState.deckCards = [];
  builderState.selectedEgo = null;
  builderState.upgradeCards = [];
}

function attachDeckPreviewListeners(root) {
  root.querySelectorAll(".deck-preview-source").forEach((button) => {
    const showPreview = () => {
      renderDeckPreview({
        image: button.dataset.previewImage,
        alt: button.dataset.previewAlt
      });
    };

    button.addEventListener("mouseenter", showPreview);
    button.addEventListener("mouseover", showPreview);
    button.addEventListener("pointerenter", showPreview);
    button.addEventListener("focus", showPreview);
    button.addEventListener("click", showPreview);
  });
}

function renderDeckPreview(item) {
  if (!item) {
    deckPreview.innerHTML = "<span>카드에 마우스를 올리면 크게 표시.</span>";
    return;
  }

  deckPreview.innerHTML = `<img src="${item.image}" alt="${item.alt}" />`;
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function renderPreview(identityId) {
  if (identityId && typeof identityId === "object") {
    identityPreview.innerHTML = `<img src="${identityId.image}" alt="${identityId.alt}" />`;
    return;
  }

  const identity = getIdentity(identityId);

  if (!identity) {
    identityPreview.innerHTML = "<span>인격에 마우스를 올리면 크게 표시.</span>";
    return;
  }

  identityPreview.innerHTML = `<img src="${identity.image}" alt="${identity.id}" />`;
}

renderBuilder();
