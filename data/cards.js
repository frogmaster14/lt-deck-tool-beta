// ========================================
// 카드 목록 데이터
// ----------------------------------------
// 1) 수감자 고유 카드 자동 생성
// 2) 인격 전용 카드 자동 생성
//
// 현재 구조:
// - 카드 효과 설명은 이미지에 들어 있다고 가정
// ========================================

const cards = [];

/**
 * 수감자 고유 카드팩 자동 생성
 *
 * @param {string} sinnerId - 수감자 ID
 * @param {number} count - 카드 종류 수
 */
function createBasePackCards(sinnerId, count) {
  for (let i = 1; i <= count; i++) {
    const numberText = String(i).padStart(2, "0");

    cards.push({
      id: `card_base_${sinnerId}_${numberText}`,
      packId: `pack_base_${sinnerId}_000`,
      image: `assets/cards/base/${sinnerId}/${numberText}.png`
    });
  }
}

/**
 * 인격 전용 카드팩 자동 생성
 *
 * @param {string} identityId - 인격 ID (identities.js의 id와 정확히 일치해야 함)
 * @param {number} count - 카드 종류 수
 */
function createIdentityPackCards(identityId, count) {
  for (let i = 1; i <= count; i++) {
    const numberText = String(i).padStart(2, "0");

    cards.push({
      id: `card_identity_${identityId}_${numberText}`,
      packId: `pack_identity_${identityId}`,
      image: `assets/cards/identity/${identityId}/${numberText}.png`
    });
  }
}

// ========================================
// 수감자 고유 카드 자동 생성
// ========================================

const basePackData = [
  ["yi_sang", 8],
  ["faust", 8],
  ["don_quixote", 8],
  ["ryoshu", 8],
  ["meursault", 7],
  ["hong_lu", 7],
  ["heathcliff", 8],
  ["ishmael", 8],
  ["rodion", 7],
  ["sinclair", 7],
  ["outis", 7],
  ["gregor", 7]
];

basePackData.forEach(([sinnerId, count]) => {
  createBasePackCards(sinnerId, count);
});

// ========================================
// 인격 전용 카드 자동 생성
// ========================================
const identityPackData = [
  // 이상
  ["yi_sang_lcb", 3],
  ["yi_sang_mourning", 3],
  ["yi_sang_bullet", 3],
  ["yi_sang_ring", 3],

  // 파우스트
  ["faust_lcb", 3],
  ["faust_gripper", 3],
  ["faust_seven_south", 3],
  ["faust_index", 3],

  // 돈키호테
  ["don_quixote_lcb", 3],
  ["don_quixote_blade", 3],
  ["don_quixote_cinq_east", 3],
  ["don_quixote_wcorp", 3],

  // 료슈
  ["ryoshu_lcb", 3],
  ["ryoshu_wcorp", 3],
  ["ryoshu_edgar_butler", 3],
  ["ryoshu_chef", 3],

  // 뫼르소
  ["meursault_lcb", 3],
  ["meursault_cinq_west", 3],
  ["meursault_thumb_east", 4],

  // 홍루
  ["hong_lu_lcb", 3],
  ["hong_lu_kk_boss", 3],
  ["hong_lu_rcorp_reindeer", 3],

  // 히스클리프
  ["heathcliff_lcb", 3],
  ["heathcliff_fox_rain", 3],
  ["heathcliff_kurokumo", 3],
  ["heathcliff_shi_south", 3],

  // 이스마엘
  ["ishmael_lcb", 3],
  ["ishmael_kurokumo", 3],
  ["ishmael_edgar_butler", 3],
  ["ishmael_office", 4],

  // 로쟈
  ["rodion_lcb", 3],
  ["rodion_lamancha", 4],
  ["rodion_lobotomy", 6],

  // 싱클레어
  ["sinclair_grip", 3],
  ["sinclair_lcb", 3],
  ["sinclair_mariachi", 3],
  ["sinclair_middle", 3],

  // 오티스
  ["outis_lcb", 3],
  ["outis_wuthering_butler", 3],
  ["outis_blade", 3],

  // 그레고르
  ["gregor_lcb", 3],
  ["gregor_zwei_south", 3],
  ["gregor_survivor", 3]
];

identityPackData.forEach(([identityId, count]) => {
  createIdentityPackCards(identityId, count);
});