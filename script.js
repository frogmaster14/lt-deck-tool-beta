// ========================================
// 전역 상태
// ========================================
const STORAGE_KEY = "limbusDeckBuilderSavedDecks";

// 현재 앱 상태
const appState = {
  // 현재 인격 목록을 보고 있는 수감자 ID
  browsingSinnerId: null,

  // 현재 선택 중인 슬롯 ("front" 또는 "back")
  activePositionSlot: "front",

  // 전위 / 후위 인격 ID
  frontIdentityId: null,
  backIdentityId: null,

  // 현재 덱에 들어간 카드 ID 목록
  currentDeckCards: []
};

// ========================================
// DOM 요소 가져오기
// ========================================
const identityPage = document.getElementById("identityPage");
const cardPage = document.getElementById("cardPage");
const savePage = document.getElementById("savePage");

const goIdentityPage = document.getElementById("goIdentityPage");
const goCardPage = document.getElementById("goCardPage");
const goSavePage = document.getElementById("goSavePage");

const sinnerList = document.getElementById("sinnerList");
const identityList = document.getElementById("identityList");
const packSections = document.getElementById("packSections");
const deckCardList = document.getElementById("deckCardList");
const savedDeckList = document.getElementById("savedDeckList");

const frontIdentityText = document.getElementById("frontIdentityText");
const backIdentityText = document.getElementById("backIdentityText");
const deckStatusText = document.getElementById("deckStatusText");
const deckCountText = document.getElementById("deckCountText");

const swapPositionsBtn = document.getElementById("swapPositionsBtn");
const selectFrontSlotBtn = document.getElementById("selectFrontSlotBtn");
const selectBackSlotBtn = document.getElementById("selectBackSlotBtn");

const deckNameInput = document.getElementById("deckNameInput");
const saveDeckBtn = document.getElementById("saveDeckBtn");
const saveMessage = document.getElementById("saveMessage");

// ========================================
// 공용 함수
// ========================================

// ID로 수감자 찾기
function getSinnerById(sinnerId) {
  return sinners.find((sinner) => sinner.id === sinnerId);
}

// ID로 인격 찾기
function getIdentityById(identityId) {
  return identities.find((identity) => identity.id === identityId);
}

// ID로 카드 찾기
function getCardById(cardId) {
  return cards.find((card) => card.id === cardId);
}

// 현재 덱 카드 수
function getDeckCount() {
  return appState.currentDeckCards.length;
}

// 현재 덱이 20장인지 확인
function isDeckComplete() {
  return getDeckCount() === 20;
}

// 저장된 덱 목록 불러오기
function getSavedDecks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 저장된 덱 목록 저장하기
function setSavedDecks(savedDecks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecks));
}

// 현재 덱 상태 문자열
function getDeckStatusLabel() {
  return isDeckComplete() ? "완성" : "불충족";
}

// 현재 선택된 인격 2개가 유효한지 확인
function hasTwoValidIdentities() {
  return !!appState.frontIdentityId && !!appState.backIdentityId;
}

// 현재 선택된 전위/후위 인격의 수감자가 서로 다른지 확인
function arePositionsValid() {
  if (!hasTwoValidIdentities()) return false;

  const frontIdentity = getIdentityById(appState.frontIdentityId);
  const backIdentity = getIdentityById(appState.backIdentityId);

  if (!frontIdentity || !backIdentity) return false;

  return frontIdentity.sinnerId !== backIdentity.sinnerId;
}

// 현재 전위/후위 기준 사용 가능한 팩 4개 반환
function getAvailablePackInfos() {
  if (!hasTwoValidIdentities() || !arePositionsValid()) return [];

  const frontIdentity = getIdentityById(appState.frontIdentityId);
  const backIdentity = getIdentityById(appState.backIdentityId);

  const frontSinner = getSinnerById(frontIdentity.sinnerId);
  const backSinner = getSinnerById(backIdentity.sinnerId);

  return [
    {
      label: `전위 ${frontSinner.name} 고유 카드팩`,
      packId: frontSinner.basePackId
    },
    {
      label: `전위 ${frontIdentity.name} 전용 카드팩`,
      packId: frontIdentity.personalPackId
    },
    {
      label: `후위 ${backSinner.name} 고유 카드팩`,
      packId: backSinner.basePackId
    },
    {
      label: `후위 ${backIdentity.name} 전용 카드팩`,
      packId: backIdentity.personalPackId
    }
  ];
}

// 특정 카드가 현재 덱에 몇 장 들어갔는지 반환
function getCurrentCardCount(cardId) {
  return appState.currentDeckCards.filter((id) => id === cardId).length;
}

// 카드 추가 가능 여부 확인
function canAddCard(card) {
  if (!card) return false;

  // 총 20장을 넘기면 안 됨
  if (getDeckCount() >= 20) return false;

  // 카드별 최대 매수 제한
  const currentCopies = getCurrentCardCount(card.id);
  if (currentCopies >= card.maxCopies) return false;

  return true;
}

// 카드 추가
function addCardToDeck(cardId) {
  const card = getCardById(cardId);
  if (!card) return;

  if (!canAddCard(card)) {
    return;
  }

  appState.currentDeckCards.push(cardId);
  renderAll();
}

// 카드 제거 (덱에서 첫 번째 일치 카드 제거)
function removeCardFromDeck(cardId) {
  const index = appState.currentDeckCards.findIndex((id) => id === cardId);
  if (index === -1) return;

  appState.currentDeckCards.splice(index, 1);
  renderAll();
}

// 페이지 전환
function showPage(pageName) {
  identityPage.classList.remove("active");
  cardPage.classList.remove("active");
  savePage.classList.remove("active");

  if (pageName === "identity") identityPage.classList.add("active");
  if (pageName === "card") cardPage.classList.add("active");
  if (pageName === "save") savePage.classList.add("active");
}

// ========================================
// 렌더링 함수들
// ========================================

// 상단 요약 렌더링
function renderSummary() {
  const frontIdentity = getIdentityById(appState.frontIdentityId);
  const backIdentity = getIdentityById(appState.backIdentityId);

  frontIdentityText.textContent = frontIdentity ? frontIdentity.name : "미선택";
  backIdentityText.textContent = backIdentity ? backIdentity.name : "미선택";

  deckStatusText.textContent = getDeckStatusLabel();
  deckCountText.textContent = `${getDeckCount()} / 20`;

  selectFrontSlotBtn.classList.toggle("active-slot", appState.activePositionSlot === "front");
  selectBackSlotBtn.classList.toggle("active-slot", appState.activePositionSlot === "back");
}

// 수감자 목록 렌더링
function renderSinnerList() {
  sinnerList.innerHTML = "";

  sinners.forEach((sinner) => {
    const box = document.createElement("div");
box.className = "item-box portrait-box";
box.title = sinner.name;

box.innerHTML = `
  <div class="portrait-image-wrap">
    <img
      src="${sinner.image}"
      alt="${sinner.name}"
      class="portrait-image"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="portrait-fallback">${sinner.name}</div>
  </div>
  <div class="portrait-name">${sinner.name}</div>
`;

    if (appState.browsingSinnerId === sinner.id) {
      box.classList.add("selected");
    }

    box.addEventListener("click", () => {
      appState.browsingSinnerId = sinner.id;
      renderAll();
    });

    sinnerList.appendChild(box);
  });
}

// 현재 보고 있는 수감자의 인격 목록 렌더링
function renderIdentityList() {
  identityList.innerHTML = "";

  if (!appState.browsingSinnerId) {
    identityList.innerHTML = "<p>먼저 수감자를 선택하세요.</p>";
    return;
  }

  const targetIdentities = identities.filter(
    (identity) => identity.sinnerId === appState.browsingSinnerId
  );

  if (targetIdentities.length === 0) {
    identityList.innerHTML = "<p>이 수감자에 등록된 인격이 없습니다.</p>";
    return;
  }

  targetIdentities.forEach((identity) => {
    const box = document.createElement("div");
box.className = "item-box portrait-box";
box.title = identity.name;

box.innerHTML = `
  <div class="portrait-image-wrap">
    <img
      src="${identity.image}"
      alt="${identity.name}"
      class="portrait-image"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="portrait-fallback">${identity.name}</div>
  </div>
  <div class="portrait-name">${identity.name}</div>
`;

    const isSelected =
      appState.frontIdentityId === identity.id || appState.backIdentityId === identity.id;

    if (isSelected) {
      box.classList.add("selected");
    }

    box.addEventListener("click", () => {
      handleIdentityClick(identity.id);
    });

    identityList.appendChild(box);
  });
}

// 인격 클릭 처리
function handleIdentityClick(identityId) {
  const identity = getIdentityById(identityId);
  if (!identity) return;

  const targetSlot = appState.activePositionSlot;

  const currentFront = getIdentityById(appState.frontIdentityId);
  const currentBack = getIdentityById(appState.backIdentityId);

  // 현재 슬롯에 이미 같은 인격이 들어있으면 다시 눌러서 해제
  // 해제할 때도 덱이 있으면 초기화 확인
  if (targetSlot === "front" && appState.frontIdentityId === identityId) {
    if (appState.currentDeckCards.length > 0) {
      const confirmed = confirm(
        "인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
      );
      if (!confirmed) return;
    }

    appState.frontIdentityId = null;
    appState.currentDeckCards = [];
    deckNameInput.value = "";
    saveMessage.textContent = "";
    renderAll();
    return;
  }

  if (targetSlot === "back" && appState.backIdentityId === identityId) {
    if (appState.currentDeckCards.length > 0) {
      const confirmed = confirm(
        "인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
      );
      if (!confirmed) return;
    }

    appState.backIdentityId = null;
    appState.currentDeckCards = [];
    deckNameInput.value = "";
    saveMessage.textContent = "";
    renderAll();
    return;
  }

  // 같은 수감자 중복 금지
  if (
    targetSlot === "front" &&
    currentBack &&
    currentBack.sinnerId === identity.sinnerId
  ) {
    alert("같은 수감자의 인격은 전위와 후위에 동시에 선택할 수 없습니다.");
    return;
  }

  if (
    targetSlot === "back" &&
    currentFront &&
    currentFront.sinnerId === identity.sinnerId
  ) {
    alert("같은 수감자의 인격은 전위와 후위에 동시에 선택할 수 없습니다.");
    return;
  }

  // 실제로 인격 변경이 일어나는 경우, 현재 덱이 있으면 확인 후 초기화
  const isChangingIdentity =
    (targetSlot === "front" && appState.frontIdentityId !== identityId) ||
    (targetSlot === "back" && appState.backIdentityId !== identityId);

  if (isChangingIdentity && appState.currentDeckCards.length > 0) {
    const confirmed = confirm(
      "인격 구성을 변경하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    appState.currentDeckCards = [];
    deckNameInput.value = "";
    saveMessage.textContent = "";
  }

  if (targetSlot === "front") {
    appState.frontIdentityId = identityId;
  } else {
    appState.backIdentityId = identityId;
  }

  renderAll();
}

// 카드팩 섹션 렌더링
function renderPackSections() {
  packSections.innerHTML = "";

  if (!hasTwoValidIdentities() || !arePositionsValid()) {
    packSections.innerHTML = "<p>전위와 후위 인격을 먼저 올바르게 선택하세요.</p>";
    return;
  }

  const packInfos = getAvailablePackInfos();

  packInfos.forEach((packInfo) => {
    const section = document.createElement("div");
    section.className = "pack-box";

    const title = document.createElement("h4");
    title.textContent = packInfo.label;
    section.appendChild(title);

    const packCards = cards.filter((card) => card.packId === packInfo.packId);

    if (packCards.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "이 카드팩에 등록된 카드가 없습니다.";
      section.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "grid-list";

      packCards.forEach((card) => {
        const box = document.createElement("div");
box.className = "item-box card-box";

const currentCount = getCurrentCardCount(card.id);

box.title = card.name;

box.innerHTML = `
  <div class="card-image-wrap">
    <img
      src="${card.image}"
      alt="${card.name}"
      class="card-image"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="card-image-fallback">
      ${card.name}
    </div>
  </div>
  <div class="card-meta compact-meta">
    <small>${currentCount} / ${card.maxCopies}</small>
  </div>
`;

        // 더블클릭으로 카드 추가
        box.addEventListener("dblclick", () => {
          addCardToDeck(card.id);
        });

        // 드래그 가능 설정
        box.draggable = true;
        box.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", card.id);
        });

        list.appendChild(box);
      });

      section.appendChild(list);
    }

    packSections.appendChild(section);
  });
}

// 현재 덱 렌더링
function renderDeckList() {
  deckCardList.innerHTML = "";

  if (appState.currentDeckCards.length === 0) {
    deckCardList.innerHTML = "<p>덱에 카드가 없습니다.</p>";
    setupDeckDropZone();
    return;
  }

  // 같은 카드끼리 묶어서 표시
  const countedMap = {};

  appState.currentDeckCards.forEach((cardId) => {
    countedMap[cardId] = (countedMap[cardId] || 0) + 1;
  });

  Object.entries(countedMap).forEach(([cardId, count]) => {
    const card = getCardById(cardId);
    if (!card) return;

    const box = document.createElement("div");
box.className = "item-box card-box";
box.title = card.name;

box.innerHTML = `
  <div class="card-image-wrap">
    <img
      src="${card.image}"
      alt="${card.name}"
      class="card-image"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="card-image-fallback">
      ${card.name}
    </div>
  </div>
  <div class="card-meta compact-meta">
    <small>${count}장</small>
  </div>
`;

    // 더블클릭으로 카드 제거
    box.addEventListener("dblclick", () => {
      removeCardFromDeck(card.id);
    });

    // 덱 카드도 드래그 가능
    box.draggable = true;
    box.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/remove-card", card.id);
    });

    deckCardList.appendChild(box);
  });

  setupDeckDropZone();
}

// 드롭 영역 세팅
function setupDeckDropZone() {
  deckCardList.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  // 카드팩 영역에서 덱으로 드롭하면 추가
  deckCardList.addEventListener("drop", (event) => {
    event.preventDefault();

    const addCardId = event.dataTransfer.getData("text/plain");
    if (addCardId) {
      addCardToDeck(addCardId);
    }
  });

  // 덱 자체에서 드래그해서 바깥으로 빼는 건 브라우저 기본 한계 때문에 완벽하진 않아서
  // 첫 버전에서는 더블클릭 제거를 मुख्य 기능으로 쓰는 게 안전함
}

// 저장 목록 렌더링
function renderSavedDecks() {
  savedDeckList.innerHTML = "";

  const savedDecks = getSavedDecks();

  if (savedDecks.length === 0) {
    savedDeckList.innerHTML = "<p>저장된 덱이 없습니다.</p>";
    return;
  }

  savedDecks.forEach((deck) => {
    const frontIdentity = getIdentityById(deck.frontIdentityId);
    const backIdentity = getIdentityById(deck.backIdentityId);

    const cardCount = deck.cards.length;
    const statusLabel = cardCount === 20 ? "완성" : "불충족";

    const wrapper = document.createElement("div");
    wrapper.className = "saved-deck-card";

    const top = document.createElement("div");
    top.className = "saved-deck-top";
    top.innerHTML = `
      <div>
        <strong>${deck.name}</strong><br>
        <small>전위: ${frontIdentity ? frontIdentity.name : "없음"} / 후위: ${backIdentity ? backIdentity.name : "없음"}</small><br>
        <small>상태: ${statusLabel} (${cardCount}/20)</small>
      </div>
    `;

    const actionArea = document.createElement("div");
    actionArea.className = "saved-deck-actions";

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "보기";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "불러오기";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";

    const detail = document.createElement("div");
    detail.className = "saved-deck-detail";
    detail.style.display = "none";

    viewBtn.addEventListener("click", () => {
      if (detail.style.display === "none") {
        detail.style.display = "block";
        detail.innerHTML = createDeckDetailHtml(deck);
      } else {
        detail.style.display = "none";
      }
    });

    loadBtn.addEventListener("click", () => {
      appState.frontIdentityId = deck.frontIdentityId;
      appState.backIdentityId = deck.backIdentityId;
      appState.currentDeckCards = [...deck.cards];
      showPage("card");
      renderAll();
    });

    deleteBtn.addEventListener("click", () => {
      const nextDecks = getSavedDecks().filter((item) => item.id !== deck.id);
      setSavedDecks(nextDecks);
      renderAll();
    });

    actionArea.appendChild(viewBtn);
    actionArea.appendChild(loadBtn);
    actionArea.appendChild(deleteBtn);

    top.appendChild(actionArea);
    wrapper.appendChild(top);
    wrapper.appendChild(detail);

    savedDeckList.appendChild(wrapper);
  });
}

// 저장 덱 상세 HTML 생성
function createDeckDetailHtml(deck) {
  const frontIdentity = getIdentityById(deck.frontIdentityId);
  const backIdentity = getIdentityById(deck.backIdentityId);

  const countedMap = {};
  deck.cards.forEach((cardId) => {
    countedMap[cardId] = (countedMap[cardId] || 0) + 1;
  });

  let html = `
    <div><strong>전위:</strong> ${frontIdentity ? frontIdentity.name : "없음"}</div>
    <div><strong>후위:</strong> ${backIdentity ? backIdentity.name : "없음"}</div>
    <div style="margin-top:10px;"><strong>카드 목록:</strong></div>
    <div class="saved-card-grid">
  `;

  Object.entries(countedMap).forEach(([cardId, count]) => {
    const card = getCardById(cardId);
    if (!card) return;

    html += `
      <div class="saved-card-item" title="${card.name}">
        <div class="saved-card-image-wrap">
          <img
            src="${card.image}"
            alt="${card.name}"
            class="saved-card-image"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="saved-card-fallback">${card.name}</div>
        </div>
        <div class="saved-card-count">${count}장</div>
      </div>
    `;
  });

  html += `</div>`;

  return html;
}
// 전체 렌더링
function renderAll() {
  renderSummary();
  renderSinnerList();
  renderIdentityList();
  renderPackSections();
  renderDeckList();
  renderSavedDecks();
}

// ========================================
// 저장 처리
// ========================================
function saveCurrentDeck() {
  const deckName = deckNameInput.value.trim();

  if (!deckName) {
    saveMessage.textContent = "덱 이름을 입력하세요.";
    return;
  }

  if (deckName.length > 10) {
    saveMessage.textContent = "덱 이름은 10자 이하만 가능합니다.";
    return;
  }

  if (!hasTwoValidIdentities() || !arePositionsValid()) {
    saveMessage.textContent = "전위와 후위 인격을 먼저 올바르게 선택하세요.";
    return;
  }

  const savedDecks = getSavedDecks();

  // 이름 중복 금지
  const duplicated = savedDecks.some((deck) => deck.name === deckName);
  if (duplicated) {
    saveMessage.textContent = "같은 이름의 덱이 이미 있습니다.";
    return;
  }

  const newDeck = {
    id: `deck_${Date.now()}`,
    name: deckName,
    frontIdentityId: appState.frontIdentityId,
    backIdentityId: appState.backIdentityId,
    cards: [...appState.currentDeckCards],
    createdAt: new Date().toISOString()
  };

  savedDecks.push(newDeck);
  setSavedDecks(savedDecks);

  saveMessage.textContent = isDeckComplete()
    ? "덱이 저장되었습니다."
    : "불충족 상태의 덱이 저장되었습니다.";

  deckNameInput.value = "";
  renderAll();
}

// ========================================
// 이벤트 연결
// ========================================
goIdentityPage.addEventListener("click", () => {
  // 현재 덱에 카드가 들어있으면 경고
  if (appState.currentDeckCards.length > 0) {
    const confirmed = confirm(
      "인격 선택으로 이동하면 현재 덱이 초기화됩니다.\n계속하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    // 덱 초기화
    appState.currentDeckCards = [];
    deckNameInput.value = "";
    saveMessage.textContent = "";
  }

  showPage("identity");
  renderAll();
});
goCardPage.addEventListener("click", () => showPage("card"));
goSavePage.addEventListener("click", () => showPage("save"));

selectFrontSlotBtn.addEventListener("click", () => {
  appState.activePositionSlot = "front";
  renderSummary();
});

selectBackSlotBtn.addEventListener("click", () => {
  appState.activePositionSlot = "back";
  renderSummary();
});

// 전후위 교체 버튼
swapPositionsBtn.addEventListener("click", () => {
  const temp = appState.frontIdentityId;
  appState.frontIdentityId = appState.backIdentityId;
  appState.backIdentityId = temp;
  renderAll();
});

saveDeckBtn.addEventListener("click", saveCurrentDeck);

// ========================================
// 초기 실행
// ========================================
renderAll();