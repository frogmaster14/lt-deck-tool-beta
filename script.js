const STORAGE_KEY = "limbusDeckBuilderSavedDecksV2";
const DEFAULT_MAX_COPIES = 2;

// ========================================
// 앱 상태
// ========================================
const appState = {
  currentPage: "select",
  selectedSinnerId: null,
  activePosition: "front",
  frontIdentityId: null,
  backIdentityId: null,
  manualDeckCards: [],
  keywordCounts: createEmptyKeywordCounts(),
  selectedSavedDeckId: null,
  hoverCardId: null
};

// ========================================
// DOM
// ========================================
const pageSelect = document.getElementById("pageSelect");
const pageBuild = document.getElementById("pageBuild");
const pageSave = document.getElementById("pageSave");

const sinnerGrid = document.getElementById("sinnerGrid");
const identityRow = document.getElementById("identityRow");

const frontSlotCard = document.getElementById("frontSlotCard");
const backSlotCard = document.getElementById("backSlotCard");
const frontSlotPreview = document.getElementById("frontSlotPreview");
const backSlotPreview = document.getElementById("backSlotPreview");

const swapBtn = document.getElementById("swapBtn");
const goSavePageFromSelectBtn = document.getElementById("goSavePageFromSelectBtn");
const resetSelectBtn = document.getElementById("resetSelectBtn");
const goBuildPageBtn = document.getElementById("goBuildPageBtn");

const buildFrontSummary = document.getElementById("buildFrontSummary");
const buildBackSummary = document.getElementById("buildBackSummary");
const identityPackRow = document.getElementById("identityPackRow");
const basePackRow = document.getElementById("basePackRow");
const deckRow = document.getElementById("deckRow");
const keywordCardRow = document.getElementById("keywordCardRow");
const autoCardSection = document.getElementById("auto-card-section");
const autoCardList = document.getElementById("auto-card-list");
const deckStatusInline = document.getElementById("deckStatusInline");
const deckNameInput = document.getElementById("deckNameInput");
const saveDeckBtn = document.getElementById("saveDeckBtn");
const saveMessage = document.getElementById("saveMessage");
const backToSelectBtn = document.getElementById("backToSelectBtn");
const resetDeckBtn = document.getElementById("resetDeckBtn");
const goSavePageFromBuildBtn = document.getElementById("goSavePageFromBuildBtn");
const goSavePageFromSideBtn = document.getElementById("goSavePageFromSideBtn");
const hoverPreview = document.getElementById("hoverPreview");

const savedDeckList = document.getElementById("savedDeckList");
const renameInput = document.getElementById("renameInput");
const renameDeckBtn = document.getElementById("renameDeckBtn");
const generateCodeBtn = document.getElementById("generateCodeBtn");
const generatedCodeArea = document.getElementById("generatedCodeArea");
const loadCodeInput = document.getElementById("loadCodeInput");
const loadCodeBtn = document.getElementById("loadCodeBtn");
const goCreateDeckBtn = document.getElementById("goCreateDeckBtn");
const deleteDeckBtn = document.getElementById("deleteDeckBtn");
const savePageMessage = document.getElementById("savePageMessage");

// ========================================
// 조회용 맵
// ========================================
const sinnerById = Object.fromEntries(sinners.map((sinner) => [sinner.id, sinner]));
const identityById = Object.fromEntries(identities.map((identity) => [identity.id, identity]));
const cardById = Object.fromEntries(cards.map((card) => [card.id, card]));

const identitiesBySinnerId = {};
identities.forEach((identity) => {
  if (!identitiesBySinnerId[identity.sinnerId]) {
    identitiesBySinnerId[identity.sinnerId] = [];
  }
  identitiesBySinnerId[identity.sinnerId].push(identity);
});

const cardsByPackId = {};
cards.forEach((card) => {
  if (!card.packId) return;
  if (!cardsByPackId[card.packId]) {
    cardsByPackId[card.packId] = [];
  }
  cardsByPackId[card.packId].push(card);
});

const keywordCardByKeywordId = {};
cards.forEach((card) => {
  if (card.type === "keyword" && card.keywordId) {
    keywordCardByKeywordId[card.keywordId] = card;
  }
});

const autoCountByIdentityId = {};
identityPackData.forEach(([identityId, , autoCount = 0]) => {
  autoCountByIdentityId[identityId] = autoCount;
});

const baseAutoCountBySinnerId = {};
baseAutoPackData.forEach(([sinnerId, autoCount = 0]) => {
  baseAutoCountBySinnerId[sinnerId] = autoCount;
});

// ========================================
// 공유코드용 인덱스 맵
// ----------------------------------------
// 데이터 순서를 크게 바꾸면 예전 공유코드가 깨질 수 있음
// ========================================
const identityIndexMap = {};
const identityReverseMap = {};
identities.forEach((identity, index) => {
  identityIndexMap[identity.id] = index;
  identityReverseMap[index] = identity.id;
});

const cardIndexMap = {};
const cardReverseMap = {};
cards.forEach((card, index) => {
  cardIndexMap[card.id] = index;
  cardReverseMap[index] = card.id;
});

// ========================================
// 기본 유틸
// ========================================
function createEmptyKeywordCounts() {
  return {
    tremor: 0,
    bleed: 0,
    sinking: 0,
    poise: 0,
    burn: 0,
    rupture: 0,
    charge: 0
  };
}

function getSinnerById(id) {
  return sinnerById[id] || null;
}

function getIdentityById(id) {
  return identityById[id] || null;
}

function getCardById(id) {
  return cardById[id] || null;
}

function getSavedDecks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setSavedDecks(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function showPage(pageName) {
  appState.currentPage = pageName;

  pageSelect.classList.remove("active");
  pageBuild.classList.remove("active");
  pageSave.classList.remove("active");

  if (pageName === "select") pageSelect.classList.add("active");
  if (pageName === "build") pageBuild.classList.add("active");
  if (pageName === "save") pageSave.classList.add("active");
}

function getCardMaxCopies() {
  return DEFAULT_MAX_COPIES;
}

function getManualDeckCount() {
  return appState.manualDeckCards.length;
}

function getCurrentCardCount(cardId) {
  let count = 0;
  for (const id of appState.manualDeckCards) {
    if (id === cardId) count += 1;
  }
  return count;
}

function getManualDeckCountMap() {
  const countMap = {};
  appState.manualDeckCards.forEach((cardId) => {
    countMap[cardId] = (countMap[cardId] || 0) + 1;
  });
  return countMap;
}

function isDeckComplete() {
  return getManualDeckCount() === 20;
}

function resetCurrentDeck() {
  appState.manualDeckCards = [];
  appState.keywordCounts = createEmptyKeywordCounts();
  appState.hoverCardId = null;
  deckNameInput.value = "";
  saveMessage.textContent = "";
}

function askResetDeckByIdentityChange(message) {
  if (appState.manualDeckCards.length === 0) return true;
  return confirm(message);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSelectedFrontIdentity() {
  return getIdentityById(appState.frontIdentityId);
}

function getSelectedBackIdentity() {
  return getIdentityById(appState.backIdentityId);
}

function hasTwoValidIdentities() {
  const front = getSelectedFrontIdentity();
  const back = getSelectedBackIdentity();

  if (!front || !back) return false;
  return front.sinnerId !== back.sinnerId;
}

function getIdentityCardsByPosition(position) {
  const identity = position === "front" ? getSelectedFrontIdentity() : getSelectedBackIdentity();
  if (!identity) return [];
  return cardsByPackId[`pack_identity_${identity.id}`] || [];
}

function getBaseCardsByPosition(position) {
  const identity = position === "front" ? getSelectedFrontIdentity() : getSelectedBackIdentity();
  if (!identity) return [];

  const sinner = getSinnerById(identity.sinnerId);
  if (!sinner) return [];

  return cardsByPackId[sinner.basePackId] || [];
}

function getDeckStatusText() {
  return `${getManualDeckCount()} / 20${isDeckComplete() ? "" : " 불충족"}`;
}

function getFrontBackIdentityIdsFromState() {
  return [appState.frontIdentityId, appState.backIdentityId].filter(Boolean);
}

// ========================================
// 키워드 관련
// ========================================
function resetKeywordCounts() {
  appState.keywordCounts = createEmptyKeywordCounts();
}

function getKeywordsForCardId(cardId) {
  const result = [];

  Object.entries(keywordSourceMap).forEach(([keywordId, sourceCardIds]) => {
    if (sourceCardIds.includes(cardId)) {
      result.push(keywordId);
    }
  });

  return result;
}

function applyKeywordCountsForAddedCard(cardId) {
  const relatedKeywords = getKeywordsForCardId(cardId);

  relatedKeywords.forEach((keywordId) => {
    if (appState.keywordCounts[keywordId] == null) {
      appState.keywordCounts[keywordId] = 0;
    }
    appState.keywordCounts[keywordId] += 1;
  });
}

function applyKeywordCountsForRemovedCard(cardId) {
  const relatedKeywords = getKeywordsForCardId(cardId);

  relatedKeywords.forEach((keywordId) => {
    if (appState.keywordCounts[keywordId] == null) {
      appState.keywordCounts[keywordId] = 0;
    }

    appState.keywordCounts[keywordId] -= 1;

    if (appState.keywordCounts[keywordId] < 0) {
      appState.keywordCounts[keywordId] = 0;
    }
  });
}

function rebuildKeywordCountsFromManualDeck() {
  resetKeywordCounts();

  appState.manualDeckCards.forEach((cardId) => {
    applyKeywordCountsForAddedCard(cardId);
  });
}

function getKeywordCardsForCurrentDeck() {
  return getKeywordCardsForCardList(appState.manualDeckCards);
}
function getKeywordCardsForCardList(cardIdList) {
  const keywordCounts = createEmptyKeywordCounts();

  cardIdList.forEach((cardId) => {
    getKeywordsForCardId(cardId).forEach((keywordId) => {
      if (keywordCounts[keywordId] == null) {
        keywordCounts[keywordId] = 0;
      }
      keywordCounts[keywordId] += 1;
    });
  });

  return Object.entries(keywordCounts)
    .filter(([, count]) => count > 0)
    .map(([keywordId]) => keywordCardByKeywordId[keywordId])
    .filter(Boolean);
}

function getKeywordIconPath(keywordId) {
  return `assets/cards/keyword/icon/${keywordId}.png`;
}

function getSpecialCardsForIdentityIds(identityIds) {
  const result = [];
  const addedCardIds = new Set();
  const usedSinnerIds = new Set();

  identityIds.forEach((identityId) => {
    const identity = getIdentityById(identityId);
    if (!identity) return;

    const autoCount = autoCountByIdentityId[identityId] || 0;
    const suffix = identityId.slice(identity.sinnerId.length + 1);

    for (let i = 1; i <= autoCount; i++) {
      const cardId = `card_special_identity_${identityId}_${i}`;
      if (addedCardIds.has(cardId)) continue;

      const card = getCardById(cardId);
      if (card) {
        result.push(card);
      } else {
        result.push({
          id: cardId,
          image: `assets/cards/special/identity/${identity.sinnerId}/${suffix}/${i}.png`
        });
      }

      addedCardIds.add(cardId);
    }

    if (usedSinnerIds.has(identity.sinnerId)) return;
    usedSinnerIds.add(identity.sinnerId);

    const baseAutoCount = baseAutoCountBySinnerId[identity.sinnerId] || 0;

    for (let i = 1; i <= baseAutoCount; i++) {
      const cardId = `card_special_base_${identity.sinnerId}_${i}`;
      if (addedCardIds.has(cardId)) continue;

      const card = getCardById(cardId);
      if (card) {
        result.push(card);
      } else {
        result.push({
          id: cardId,
          image: `assets/cards/special/base/${identity.sinnerId}/${i}.png`
        });
      }

      addedCardIds.add(cardId);
    }
  });

  return result;
}

function getSpecialCardsForDeck(deck) {
  return getSpecialCardsForIdentityIds([deck.frontIdentityId, deck.backIdentityId].filter(Boolean));
}




// ========================================
// 자동추가 카드 관련
// ----------------------------------------
// 1) 인격 자동추가 카드
// 2) 수감자 고유팩 자동추가 카드
// 둘 다 지원
// ========================================
function getSpecialCardsForSelectedIdentities() {
  return getSpecialCardsForIdentityIds(getFrontBackIdentityIdsFromState());
}



// ========================================
// 공용 렌더 유틸
// ========================================
function createImageTileMarkup(imagePath) {
  return `
    <img
      src="${imagePath || ""}"
      alt=""
      onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
    />
    <div class="card-fallback"></div>
  `;
}

function appendViewOnlyCardTile(target, card, extraClassName = "") {
  const tile = document.createElement("div");
  tile.className = `card-tile ${extraClassName}`.trim();

  tile.innerHTML = `
    ${createImageTileMarkup(card.image)}
    <div class="card-count"></div>
  `;

  tile.addEventListener("mouseenter", () => {
    appState.hoverCardId = card.id;
    renderHoverPreview();
  });

  target.appendChild(tile);
}

function renderCardTiles(target, cardList, mode, countOverrideMap = null) {
  target.innerHTML = "";

  if (!cardList || cardList.length === 0) {
    target.innerHTML = `<div class="save-message">표시할 카드가 없습니다.</div>`;
    return;
  }

  cardList.forEach((card) => {
    const tile = document.createElement("div");
    tile.className = "card-tile";

    let bottomText = "";

    if (mode === "add") {
      const currentCount = countOverrideMap ? (countOverrideMap[card.id] || 0) : getCurrentCardCount(card.id);
      bottomText = `${currentCount} / ${getCardMaxCopies()}`;
    }

    if (mode === "remove") {
      const currentCount = countOverrideMap ? (countOverrideMap[card.id] || 0) : getCurrentCardCount(card.id);
      bottomText = `${currentCount}장`;
    }

    tile.innerHTML = `
      ${createImageTileMarkup(card.image)}
      <div class="card-count">${bottomText}</div>
    `;

    tile.addEventListener("mouseenter", () => {
      appState.hoverCardId = card.id;
      renderHoverPreview();
    });

    if (mode === "add") {
      tile.addEventListener("click", () => {
        addCardToDeck(card.id);
      });
    }

    if (mode === "remove") {
      tile.addEventListener("click", () => {
        removeCardFromDeck(card.id);
      });
    }

    target.appendChild(tile);
  });
}

// ========================================
// 선택 페이지 렌더
// ========================================
function renderPageSelect() {
  renderSinnerGrid();
  renderIdentityRow();
  renderSelectedSlots();
}

function renderSinnerGrid() {
  sinnerGrid.innerHTML = "";

  sinners.forEach((sinner) => {
    const item = document.createElement("div");
    item.className = "sinner-item";

    if (appState.selectedSinnerId === sinner.id) {
      item.classList.add("selected");
    }

    item.innerHTML = `
      <div class="sinner-thumb-wrap">
        <img
          src="${sinner.image || ""}"
          alt=""
          class="sinner-thumb"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
        />
        <div class="sinner-fallback"></div>
      </div>
    `;

    item.addEventListener("click", () => {
      appState.selectedSinnerId = sinner.id;
      renderPageSelect();
    });

    sinnerGrid.appendChild(item);
  });
}

function renderIdentityRow() {
  identityRow.innerHTML = "";

  if (!appState.selectedSinnerId) {
    identityRow.innerHTML = `<div class="save-message">먼저 수감자를 선택해야 합니다.</div>`;
    return;
  }

  const targetIdentities = identitiesBySinnerId[appState.selectedSinnerId] || [];

  targetIdentities.forEach((identity) => {
    const item = document.createElement("div");
    item.className = "identity-item";

    if (appState.frontIdentityId === identity.id || appState.backIdentityId === identity.id) {
      item.classList.add("selected");
    }

    item.innerHTML = `
      <div class="identity-image-wrap">
        <img
          src="${identity.image || ""}"
          alt=""
          class="identity-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
        />
        <div class="identity-fallback"></div>
      </div>
    `;

    item.addEventListener("click", () => {
      handleIdentityClick(identity.id);
    });

    identityRow.appendChild(item);
  });
}

function renderSelectedSlots() {
  const frontIdentity = getSelectedFrontIdentity();
  const backIdentity = getSelectedBackIdentity();

  frontSlotCard.classList.toggle("active-slot-card", appState.activePosition === "front");
  backSlotCard.classList.toggle("active-slot-card", appState.activePosition === "back");

  if (frontIdentity) {
    frontSlotPreview.className = "slot-preview large-slot-preview";
    frontSlotPreview.innerHTML = `
      <img
        src="${frontIdentity.image || ""}"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
      />
      <div class="slot-fallback"></div>
    `;
  } else {
    frontSlotPreview.className = "slot-preview large-slot-preview empty";
    frontSlotPreview.textContent = "선택 필요";
  }

  if (backIdentity) {
    backSlotPreview.className = "slot-preview large-slot-preview";
    backSlotPreview.innerHTML = `
      <img
        src="${backIdentity.image || ""}"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
      />
      <div class="slot-fallback"></div>
    `;
  } else {
    backSlotPreview.className = "slot-preview large-slot-preview empty";
    backSlotPreview.textContent = "선택 필요";
  }
}

// ========================================
// 빌드 페이지 렌더
// ========================================
function renderPageBuild() {
  renderBuildSummaries();
  renderPackRows();
  renderDeckRow();
  renderKeywordCardRow();
  renderAutoCardList();
  renderHoverPreview();
}

function renderBuildSummaries() {
  const frontIdentity = getSelectedFrontIdentity();
  const backIdentity = getSelectedBackIdentity();

  if (frontIdentity) {
    buildFrontSummary.className = "build-summary-card has-image small-summary-card";
    buildFrontSummary.innerHTML = `
      <img
        src="${frontIdentity.image || ""}"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
      />
      <div class="slot-fallback"></div>
    `;
  } else {
    buildFrontSummary.className = "build-summary-card small-summary-card";
    buildFrontSummary.textContent = "전방 미선택";
  }

  if (backIdentity) {
    buildBackSummary.className = "build-summary-card has-image small-summary-card";
    buildBackSummary.innerHTML = `
      <img
        src="${backIdentity.image || ""}"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
      />
      <div class="slot-fallback"></div>
    `;
  } else {
    buildBackSummary.className = "build-summary-card small-summary-card";
    buildBackSummary.textContent = "후방 미선택";
  }
}

function renderPackRows() {
  identityPackRow.innerHTML = "";
  basePackRow.innerHTML = "";

  if (!hasTwoValidIdentities()) {
    identityPackRow.innerHTML = `<div class="save-message">전방/후방 인격을 먼저 제대로 선택해야 합니다.</div>`;
    basePackRow.innerHTML = "";
    return;
  }

  const identityCards = [
    ...getIdentityCardsByPosition("front"),
    ...getIdentityCardsByPosition("back")
  ];

  const baseCards = [
    ...getBaseCardsByPosition("front"),
    ...getBaseCardsByPosition("back")
  ];

  renderCardTiles(identityPackRow, identityCards, "add");
  renderCardTiles(basePackRow, baseCards, "add");
}

function renderDeckRow() {
  deckRow.innerHTML = "";
  deckStatusInline.textContent = getDeckStatusText();

  if (appState.manualDeckCards.length === 0) {
    deckRow.innerHTML = `<div class="save-message">덱이 비어 있습니다.</div>`;
    return;
  }

  const countMap = getManualDeckCountMap();
  const uniqueCards = Object.keys(countMap)
    .map((cardId) => getCardById(cardId))
    .filter(Boolean);

  renderCardTiles(deckRow, uniqueCards, "remove", countMap);
}

function renderKeywordCardRow() {
  if (!keywordCardRow) return;

  const keywordCards = getKeywordCardsForCurrentDeck();
  const specialCards = getSpecialCardsForSelectedIdentities();

  keywordCardRow.innerHTML = "";

  if (keywordCards.length === 0 && specialCards.length === 0) {
    keywordCardRow.innerHTML = `<div class="save-message">표시할 카드가 없습니다.</div>`;
    return;
  }

  keywordCards.forEach((card) => {
    appendViewOnlyCardTile(keywordCardRow, card);
  });

  specialCards.forEach((card) => {
    appendViewOnlyCardTile(keywordCardRow, card, "support-special-card-tile");
  });
}



function renderAutoCardList() {
  if (autoCardList) {
    autoCardList.innerHTML = "";
  }

  if (autoCardSection) {
    autoCardSection.style.display = "none";
  }
}



function renderHoverPreview() {
  const card = getCardById(appState.hoverCardId);

  if (!card) {
    hoverPreview.className = "hover-preview empty-preview";
    hoverPreview.textContent = "마우스를 올리면 확대됩니다";
    return;
  }

  hoverPreview.className = "hover-preview";
  hoverPreview.innerHTML = `
    <img
      src="${card.image || ""}"
      alt=""
      class="preview-image"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
    />
    <div class="preview-fallback"></div>
  `;
}

// ========================================
// 저장 페이지 렌더
// ========================================
function renderPageSave() {
  renderSavedDeckList();
}

function renderSavedDeckList() {
  savedDeckList.innerHTML = "";
  const savedDecks = getSavedDecks();

  if (savedDecks.length === 0) {
    savedDeckList.innerHTML = `<div class="save-message">저장된 덱이 없습니다.</div>`;
    return;
  }

  savedDecks.forEach((deck) => {
    const frontIdentity = getIdentityById(deck.frontIdentityId);
    const backIdentity = getIdentityById(deck.backIdentityId);

    const wrapper = document.createElement("div");
    wrapper.className = "saved-deck-card";

    const detailId = `detail_${deck.id}`;

    wrapper.innerHTML = `
      <div class="saved-deck-top">
        <div class="saved-position-pair">
          <div class="saved-position-item">
            <img
              src="${frontIdentity?.image || ""}"
              alt=""
              onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
            />
            <div class="identity-fallback"></div>
            <div class="saved-position-label">전방</div>
          </div>
          <div class="saved-position-item">
            <img
              src="${backIdentity?.image || ""}"
              alt=""
              onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
            />
            <div class="identity-fallback"></div>
            <div class="saved-position-label">후방</div>
          </div>
        </div>

        <div>
          <div class="saved-deck-name">${escapeHtml(deck.name)}</div>
          <div class="saved-deck-sub">${deck.cards.length} / 20</div>
        </div>

        <div class="saved-actions">
          <button class="ui-btn" data-action="load" data-id="${deck.id}">불러오기</button>
          <button class="ui-btn" data-action="detail" data-id="${deck.id}">자세히 보기</button>
          <button class="ui-btn" data-action="select" data-id="${deck.id}">선택</button>
        </div>
      </div>

      <div id="${detailId}" class="saved-detail">
        ${createDeckDetailHtml(deck)}
      </div>
    `;

    savedDeckList.appendChild(wrapper);
  });

  savedDeckList.querySelectorAll("button[data-action]").forEach((button) => {
    const action = button.dataset.action;
    const deckId = button.dataset.id;

    button.addEventListener("click", () => {
      if (action === "load") {
        loadSavedDeck(deckId);
        return;
      }

      if (action === "detail") {
        const detail = document.getElementById(`detail_${deckId}`);
        if (!detail) return;
        detail.style.display = detail.style.display === "block" ? "none" : "block";
        return;
      }

      if (action === "select") {
        appState.selectedSavedDeckId = deckId;
        savePageMessage.textContent = "덱이 선택되었습니다.";
      }
    });
  });
}

function createDeckDetailHtml(deck) {
  const countMap = {};
  deck.cards.forEach((cardId) => {
    countMap[cardId] = (countMap[cardId] || 0) + 1;
  });

  const keywordCards = getKeywordCardsForCardList(deck.cards);
  const specialCards = getSpecialCardsForDeck(deck);

  let html = `
    <div class="saved-detail-support-strip">
      <div class="saved-detail-support-box saved-keyword-box">
        <div class="saved-detail-label">사용 키워드</div>
        <div class="saved-keyword-icon-row">
  `;

  if (keywordCards.length > 0) {
    keywordCards.forEach((card) => {
      html += `
        <div class="saved-keyword-icon-item">
          <img
            src="${getKeywordIconPath(card.keywordId)}"
            alt=""
            data-fallback="${card.image || ""}"
            onerror="if (this.dataset.fallback && this.src !== this.dataset.fallback) { this.src = this.dataset.fallback; } else { this.style.display='none'; }"
          />
        </div>
      `;
    });
  } else {
    html += `<div class="saved-empty-support">없음</div>`;
  }

  html += `
        </div>
      </div>

      <div class="saved-detail-support-box saved-special-box">
        <div class="saved-detail-label">특수 카드</div>
        <div class="saved-special-card-row">
  `;

  if (specialCards.length > 0) {
    specialCards.forEach((card) => {
      html += `
        <div class="saved-special-card-item">
          <img
            src="${card.image || ""}"
            alt=""
            onerror="this.style.display='none';"
          />
        </div>
      `;
    });
  } else {
    html += `<div class="saved-empty-support">없음</div>`;
  }

  html += `
        </div>
      </div>
    </div>
  `;

  html += `<div class="saved-card-grid">`;

  Object.entries(countMap).forEach(([cardId, count]) => {
    const card = getCardById(cardId);
    if (!card) return;

    html += `
      <div class="saved-card-item">
        <img
          src="${card.image || ""}"
          alt=""
          class="saved-card-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
        />
        <div class="card-fallback"></div>
        <div class="saved-card-count">${count}장</div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}



// ========================================
// 핵심 로직
// ========================================
function handleIdentityClick(identityId) {
  const identity = getIdentityById(identityId);
  if (!identity) return;

  const targetSlot = appState.activePosition;
  const currentFront = getSelectedFrontIdentity();
  const currentBack = getSelectedBackIdentity();

  if (targetSlot === "front" && currentBack && currentBack.sinnerId === identity.sinnerId) {
    alert("같은 수감자의 인격은 전방/후방에 동시에 넣을 수 없습니다.");
    return;
  }

  if (targetSlot === "back" && currentFront && currentFront.sinnerId === identity.sinnerId) {
    alert("같은 수감자의 인격은 전방/후방에 동시에 넣을 수 없습니다.");
    return;
  }

  const isRemovingSame =
    (targetSlot === "front" && appState.frontIdentityId === identityId) ||
    (targetSlot === "back" && appState.backIdentityId === identityId);

  if (isRemovingSame) {
    if (!askResetDeckByIdentityChange("인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?")) {
      return;
    }

    if (targetSlot === "front") appState.frontIdentityId = null;
    if (targetSlot === "back") appState.backIdentityId = null;

    resetCurrentDeck();
    renderAll();
    return;
  }

  const isActuallyChanging =
    (targetSlot === "front" && appState.frontIdentityId !== identityId) ||
    (targetSlot === "back" && appState.backIdentityId !== identityId);

  if (isActuallyChanging && appState.manualDeckCards.length > 0) {
    const confirmed = confirm("인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?");
    if (!confirmed) return;
    resetCurrentDeck();
  }

  if (targetSlot === "front") {
    appState.frontIdentityId = identityId;
  } else {
    appState.backIdentityId = identityId;
  }

  appState.selectedSinnerId = identity.sinnerId;
  renderAll();
}

function canAddCard(cardId) {
  const card = getCardById(cardId);
  if (!card) return false;
  if (appState.manualDeckCards.length >= 20) return false;
  if (getCurrentCardCount(cardId) >= getCardMaxCopies()) return false;
  return true;
}

function addCardToDeck(cardId) {
  if (!hasTwoValidIdentities()) {
    alert("전방/후방 인격을 먼저 선택해야 합니다.");
    return;
  }

  if (!canAddCard(cardId)) {
    return;
  }

  appState.manualDeckCards.push(cardId);
  applyKeywordCountsForAddedCard(cardId);
  renderPageBuild();
}

function removeCardFromDeck(cardId) {
  const index = appState.manualDeckCards.findIndex((id) => id === cardId);
  if (index === -1) return;

  appState.manualDeckCards.splice(index, 1);
  applyKeywordCountsForRemovedCard(cardId);
  renderPageBuild();
}

// ========================================
// 저장 / 불러오기 / 공유코드
// ========================================
function saveCurrentDeck() {
  const name = deckNameInput.value.trim();

  if (!name) {
    saveMessage.textContent = "덱 이름을 입력해야 합니다.";
    return;
  }

  if (!hasTwoValidIdentities()) {
    saveMessage.textContent = "전방/후방 인격을 먼저 제대로 선택해야 합니다.";
    return;
  }

  const savedDecks = getSavedDecks();
  if (savedDecks.some((deck) => deck.name === name)) {
    saveMessage.textContent = "같은 이름의 덱이 이미 있습니다.";
    return;
  }

  savedDecks.push({
    id: `deck_${Date.now()}`,
    name,
    frontIdentityId: appState.frontIdentityId,
    backIdentityId: appState.backIdentityId,
    cards: [...appState.manualDeckCards],
    createdAt: new Date().toISOString()
  });

  setSavedDecks(savedDecks);
  saveMessage.textContent = isDeckComplete()
    ? "덱이 저장되었습니다."
    : "불충족 상태로 저장되었습니다.";

  renderPageSave();
}

function loadSavedDeck(deckId) {
  const deck = getSavedDecks().find((item) => item.id === deckId);
  if (!deck) return;

  appState.frontIdentityId = deck.frontIdentityId;
  appState.backIdentityId = deck.backIdentityId;
  appState.manualDeckCards = [...deck.cards];
  appState.hoverCardId = null;

  const frontIdentity = getSelectedFrontIdentity();
  const backIdentity = getSelectedBackIdentity();
  appState.selectedSinnerId = frontIdentity?.sinnerId || backIdentity?.sinnerId || null;

  rebuildKeywordCountsFromManualDeck();

  deckNameInput.value = deck.name;
  saveMessage.textContent = "";

  showPage("build");
  renderAll();
}

function renameSelectedDeck() {
  const newName = renameInput.value.trim();

  if (!newName) {
    savePageMessage.textContent = "새 이름을 입력해야 합니다.";
    return;
  }

  if (!appState.selectedSavedDeckId) {
    savePageMessage.textContent = "먼저 저장 목록에서 덱 하나를 선택해야 합니다.";
    return;
  }

  const decks = getSavedDecks();
  if (decks.some((deck) => deck.name === newName && deck.id !== appState.selectedSavedDeckId)) {
    savePageMessage.textContent = "같은 이름의 덱이 이미 있다.";
    return;
  }

  const target = decks.find((deck) => deck.id === appState.selectedSavedDeckId);
  if (!target) return;

  target.name = newName;
  setSavedDecks(decks);
  savePageMessage.textContent = "이름이 변경되었습니다.";
  renameInput.value = "";
  renderPageSave();
}

function generateDeckCode() {
  if (!appState.selectedSavedDeckId) {
    savePageMessage.textContent = "먼저 저장 목록에서 덱 하나를 선택해야 합니다.";
    return;
  }

  const deck = getSavedDecks().find((item) => item.id === appState.selectedSavedDeckId);
  if (!deck) {
    savePageMessage.textContent = "선택한 덱을 찾을 수 없습니다.";
    return;
  }

  const frontIndex = identityIndexMap[deck.frontIdentityId];
  const backIndex = identityIndexMap[deck.backIdentityId];

  if (frontIndex == null || backIndex == null) {
    savePageMessage.textContent = "인격 데이터가 올바르지 않습니다.";
    return;
  }

  const countMap = {};
  deck.cards.forEach((cardId) => {
    countMap[cardId] = (countMap[cardId] || 0) + 1;
  });

  const cardPart = Object.entries(countMap)
    .map(([cardId, count]) => {
      const cardIndex = cardIndexMap[cardId];
      return cardIndex == null ? null : `${cardIndex}:${count}`;
    })
    .filter(Boolean)
    .join(";");

  generatedCodeArea.value = `${frontIndex}|${backIndex}|${cardPart}`;
  savePageMessage.textContent = "코드가 생성되었습니다.";
}

function loadDeckFromCode() {
  const raw = loadCodeInput.value.trim();

  if (!raw) {
    savePageMessage.textContent = "코드를 입력해야 합니다.";
    return;
  }

  try {
    const [frontPart, backPart, cardPart] = raw.split("|");

    if (!frontPart || !backPart || cardPart == null) {
      throw new Error("형식 오류");
    }

    const frontIdentityId = identityReverseMap[Number(frontPart)];
    const backIdentityId = identityReverseMap[Number(backPart)];

    if (!frontIdentityId || !backIdentityId) {
      throw new Error("인격 오류");
    }

    const cardsArr = [];

    if (cardPart.trim()) {
      cardPart.split(";").forEach((part) => {
        const [indexText, countText] = part.split(":");
        const cardIndex = Number(indexText);
        const count = Number(countText);
        const realId = cardReverseMap[cardIndex];

        if (!realId || !Number.isInteger(count) || count <= 0) {
          throw new Error("카드 오류");
        }

        for (let i = 0; i < count; i++) {
          cardsArr.push(realId);
        }
      });
    }

    appState.frontIdentityId = frontIdentityId;
    appState.backIdentityId = backIdentityId;
    appState.manualDeckCards = cardsArr;
    appState.hoverCardId = null;

    const frontIdentity = getSelectedFrontIdentity();
    const backIdentity = getSelectedBackIdentity();
    appState.selectedSinnerId = frontIdentity?.sinnerId || backIdentity?.sinnerId || null;

    rebuildKeywordCountsFromManualDeck();

    deckNameInput.value = "";
    savePageMessage.textContent = "코드로 덱을 불러왔습니다.";

    showPage("build");
    renderAll();
  } catch {
    savePageMessage.textContent = "코드 형식이 잘못되었습니다.";
  }
}

function deleteSelectedDeck() {
  if (!appState.selectedSavedDeckId) {
    savePageMessage.textContent = "먼저 저장 목록에서 덱 하나를 선택해야 합니다.";
    return;
  }

  const confirmed = confirm("선택한 덱을 삭제할까요?");
  if (!confirmed) return;

  const next = getSavedDecks().filter((deck) => deck.id !== appState.selectedSavedDeckId);
  setSavedDecks(next);
  appState.selectedSavedDeckId = null;
  savePageMessage.textContent = "덱이 삭제되었습니다.";
  renderPageSave();
}

// ========================================
// 이벤트
// ========================================
frontSlotCard.addEventListener("click", () => {
  appState.activePosition = "front";
  renderSelectedSlots();
});

backSlotCard.addEventListener("click", () => {
  appState.activePosition = "back";
  renderSelectedSlots();
});

swapBtn.addEventListener("click", () => {
  if (appState.manualDeckCards.length > 0) {
    const confirmed = confirm("전후방을 교체하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?");
    if (!confirmed) return;
    resetCurrentDeck();
  }

  const temp = appState.frontIdentityId;
  appState.frontIdentityId = appState.backIdentityId;
  appState.backIdentityId = temp;

  renderAll();
});

resetSelectBtn.addEventListener("click", () => {
  const confirmed = confirm("현재 선택을 초기화 하겠습니까?");
  if (!confirmed) return;

  appState.selectedSinnerId = null;
  appState.frontIdentityId = null;
  appState.backIdentityId = null;
  resetCurrentDeck();
  renderAll();
});

goBuildPageBtn.addEventListener("click", () => {
  if (!hasTwoValidIdentities()) {
    alert("전방/후방 인격을 먼저 선택해야 합니다.");
    return;
  }

  showPage("build");
  renderAll();
});

goSavePageFromSelectBtn.addEventListener("click", () => {
  showPage("save");
  renderAll();
});

backToSelectBtn.addEventListener("click", () => {
  showPage("select");
  renderAll();
});

resetDeckBtn.addEventListener("click", () => {
  if (appState.manualDeckCards.length === 0) return;

  const confirmed = confirm("현재 덱을 초기화 하시겠습니까?");
  if (!confirmed) return;

  resetCurrentDeck();
  renderAll();
});

saveDeckBtn.addEventListener("click", saveCurrentDeck);

goSavePageFromBuildBtn.addEventListener("click", () => {
  showPage("save");
  renderAll();
});

goSavePageFromSideBtn.addEventListener("click", () => {
  showPage("save");
  renderAll();
});

renameDeckBtn.addEventListener("click", renameSelectedDeck);
generateCodeBtn.addEventListener("click", generateDeckCode);
loadCodeBtn.addEventListener("click", loadDeckFromCode);
deleteDeckBtn.addEventListener("click", deleteSelectedDeck);

goCreateDeckBtn.addEventListener("click", () => {
  showPage("select");
  renderAll();
});

// ========================================
// 전체 렌더
// ========================================
function renderAll() {
  renderPageSelect();
  renderPageBuild();
  renderPageSave();
}

showPage(appState.currentPage);
renderAll();