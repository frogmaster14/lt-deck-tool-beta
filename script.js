const STORAGE_KEY = "limbusDeckBuilderSavedDecksV2";
const DEFAULT_MAX_COPIES = 2;
// =========================
// ID <-> 숫자 변환 맵
// =========================
const identityIndexMap = {};
const identityReverseMap = {};

identities.forEach((id, i) => {
  identityIndexMap[id.id] = i;
  identityReverseMap[i] = id.id;
});

const cardIndexMap = {};
const cardReverseMap = {};

cards.forEach((card, i) => {
  cardIndexMap[card.id] = i;
  cardReverseMap[i] = card.id;
});

const appState = {
  currentPage: "select",
  selectedSinnerId: null,
  activePosition: "front",
  frontIdentityId: null,
  backIdentityId: null,
  currentDeckCards: [],
  selectedSavedDeckId: null,
  hoverCardId: null
};

// =========================
// DOM
// =========================
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

// =========================
// 유틸
// =========================
function getSinnerById(id) {
  return sinners.find((item) => item.id === id);
}

function getIdentityById(id) {
  return identities.find((item) => item.id === id);
}

function getCardById(id) {
  return cards.find((item) => item.id === id);
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

function getCurrentCardCount(cardId) {
  return appState.currentDeckCards.filter((id) => id === cardId).length;
}

function isDeckComplete() {
  return appState.currentDeckCards.length === 20;
}

function resetCurrentDeck() {
  appState.currentDeckCards = [];
  deckNameInput.value = "";
  saveMessage.textContent = "";
}

function askResetDeckByIdentityChange(message) {
  if (appState.currentDeckCards.length === 0) return true;
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
  return cards.filter((card) => card.packId === `pack_identity_${identity.id}`);
}

function getBaseCardsByPosition(position) {
  const identity = position === "front" ? getSelectedFrontIdentity() : getSelectedBackIdentity();
  if (!identity) return [];

  const sinner = getSinnerById(identity.sinnerId);
  if (!sinner) return [];

  return cards.filter((card) => card.packId === sinner.basePackId);
}

function getDeckStatusText() {
  return `${appState.currentDeckCards.length} / 20${isDeckComplete() ? "" : " 불충족"}`;
}

function arrayBufferToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

// =========================
// 렌더
// =========================
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

  const targetIdentities = identities.filter(
    (identity) => identity.sinnerId === appState.selectedSinnerId
  );

  targetIdentities.forEach((identity) => {
    const item = document.createElement("div");
    item.className = "identity-item";

    if (
      appState.frontIdentityId === identity.id ||
      appState.backIdentityId === identity.id
    ) {
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
    frontSlotPreview.classList.remove("empty");
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
    backSlotPreview.classList.remove("empty");
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

function renderPageBuild() {
  renderBuildSummaries();
  renderPackRows();
  renderDeckRow();
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

function renderCardTiles(target, cardList, mode) {
  if (cardList.length === 0) {
    target.innerHTML = `<div class="save-message">표시할 카드가 없습니다.</div>`;
    return;
  }

  cardList.forEach((card) => {
    const tile = document.createElement("div");
    tile.className = "card-tile";

    const currentCount = getCurrentCardCount(card.id);
    const maxCopies = getCardMaxCopies();
    const bottomText = mode === "add"
      ? `${currentCount} / ${maxCopies}`
      : `${currentCount}장`;

    tile.innerHTML = `
      <img
        src="${card.image || ""}"
        alt=""
        onerror="this.style.display='none'; this.nextElementSibling.style.display='none';"
      />
      <div class="card-fallback"></div>
      <div class="card-count">${bottomText}</div>
    `;

    tile.addEventListener("mouseenter", () => {
      appState.hoverCardId = card.id;
      renderHoverPreview();
    });

    tile.addEventListener("click", () => {
      if (mode === "add") {
        addCardToDeck(card.id);
      } else {
        removeCardFromDeck(card.id);
      }
    });

    target.appendChild(tile);
  });
}

function renderDeckRow() {
  deckRow.innerHTML = "";
  deckStatusInline.textContent = getDeckStatusText();

  if (appState.currentDeckCards.length === 0) {
    deckRow.innerHTML = `<div class="save-message">덱이 비어 있습니다.</div>`;
    return;
  }

  const countedMap = {};

  appState.currentDeckCards.forEach((cardId) => {
    countedMap[cardId] = (countedMap[cardId] || 0) + 1;
  });

  Object.keys(countedMap).forEach((cardId) => {
    const card = getCardById(cardId);
    if (!card) return;

    const count = countedMap[cardId];
    renderCardTiles(deckRow, [card], "remove");

    const lastTile = deckRow.lastElementChild;
    if (lastTile) {
      const countLabel = lastTile.querySelector(".card-count");
      if (countLabel) countLabel.textContent = `${count}장`;
    }
  });
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
      }

      if (action === "detail") {
        const detail = document.getElementById(`detail_${deckId}`);
        if (!detail) return;
        detail.style.display = detail.style.display === "block" ? "none" : "block";
      }

      if (action === "select") {
        appState.selectedSavedDeckId = deckId;
        savePageMessage.textContent = "덱이 선택되었습니다.";
      }
    });
  });
}

function createDeckDetailHtml(deck) {
  const countedMap = {};
  deck.cards.forEach((cardId) => {
    countedMap[cardId] = (countedMap[cardId] || 0) + 1;
  });

  let html = `<div class="saved-card-grid">`;

  Object.entries(countedMap).forEach(([cardId, count]) => {
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

// =========================
// 로직
// =========================
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

  if (isActuallyChanging && appState.currentDeckCards.length > 0) {
    const confirmed = confirm(
      "인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
    );
    if (!confirmed) return;
    resetCurrentDeck();
  }

  if (targetSlot === "front") {
    appState.frontIdentityId = identityId;
  } else {
    appState.backIdentityId = identityId;
  }

  renderAll();
}

function canAddCard(cardId) {
  const card = getCardById(cardId);
  if (!card) return false;
  if (appState.currentDeckCards.length >= 20) return false;
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

  appState.currentDeckCards.push(cardId);
  renderPageBuild();
}

function removeCardFromDeck(cardId) {
  const index = appState.currentDeckCards.findIndex((id) => id === cardId);
  if (index === -1) return;

  appState.currentDeckCards.splice(index, 1);
  renderPageBuild();
}

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
    cards: [...appState.currentDeckCards],
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
  appState.currentDeckCards = [...deck.cards];
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

  const deck = getSavedDecks().find(
    (item) => item.id === appState.selectedSavedDeckId
  );
  if (!deck) return;

  const front = identityIndexMap[deck.frontIdentityId];
  const back = identityIndexMap[deck.backIdentityId];

  const countMap = {};

  deck.cards.forEach((id) => {
    const idx = cardIndexMap[id];
    countMap[idx] = (countMap[idx] || 0) + 1;
  });

  const cardPart = Object.entries(countMap)
    .map(([id, count]) => `${id}:${count}`)
    .join(";");

  const code = `${front}|${back}|${cardPart}`;

  generatedCodeArea.value = code;
  savePageMessage.textContent = "코드가 생성되었습니다.";
}

function loadDeckFromCode() {
  const raw = loadCodeInput.value.trim();

  if (!raw) {
    savePageMessage.textContent = "코드를 입력해야 합니다.";
    return;
  }

  try {
    const [front, back, cardPart] = raw.split("|");

    if (!front || !back || !cardPart) {
      throw new Error("형식 오류");
    }

    const cardsArr = [];

    cardPart.split(";").forEach((part) => {
      const [id, count] = part.split(":").map(Number);
      const realId = cardReverseMap[id];

      for (let i = 0; i < count; i++) {
        cardsArr.push(realId);
      }
    });

    appState.frontIdentityId = identityReverseMap[Number(front)];
    appState.backIdentityId = identityReverseMap[Number(back)];
    appState.currentDeckCards = cardsArr;

    deckNameInput.value = "";
    savePageMessage.textContent = "코드로 덱을 불러왔습니다.";

    showPage("build");
    renderAll();
  } catch (e) {
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

// =========================
// 이벤트
// =========================
frontSlotCard.addEventListener("click", () => {
  appState.activePosition = "front";
  renderSelectedSlots();
});

backSlotCard.addEventListener("click", () => {
  appState.activePosition = "back";
  renderSelectedSlots();
});

swapBtn.addEventListener("click", () => {
  if (appState.currentDeckCards.length > 0) {
    const confirmed = confirm(
      "전후방을 교체하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
    );
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
  if (appState.currentDeckCards.length === 0) return;
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

// =========================
// 전체 렌더
// =========================
function renderAll() {
  renderPageSelect();
  renderPageBuild();
  renderPageSave();
}

renderAll();