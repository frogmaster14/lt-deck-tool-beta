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

// ========================================
// 키워드 카드 7종 자동 등록
// ----------------------------------------
// 중요:
// - 키워드 카드는 "덱에 몇 장 들어가는 카드"가 아님
// - 그냥 이 덱이 해당 키워드를 보유 중인지 보여주는 표식 카드임
// - 그래서 키워드당 이미지 1개만 사용
//
// 이미지 파일 규칙:
// assets/cards/keyword/tremor.png
// assets/cards/keyword/bleed.png
// assets/cards/keyword/sinking.png
// assets/cards/keyword/poise.png
// assets/cards/keyword/burn.png
// assets/cards/keyword/rupture.png
// assets/cards/keyword/charge.png
//
// 지원 키워드 7종:
// - tremor  : 진동
// - bleed   : 출혈
// - sinking : 침잠
// - poise   : 호흡
// - burn    : 화상
// - rupture : 파열
// - charge  : 충전
// ========================================
const keywordCardIds = [
  "tremor",
  "bleed",
  "sinking",
  "poise",
  "burn",
  "rupture",
  "charge"
];

keywordCardIds.forEach((keywordId) => {
  cards.push({
    id: `card_keyword_${keywordId}`,
    type: "keyword",
    keywordId: keywordId,
    image: `assets/cards/keyword/${keywordId}.png`
  });
});

// ========================================
// 키워드 소스 카드 매핑
// ----------------------------------------
// 구조:
// {
//   키워드ID: [그 키워드를 부여하는 카드ID들]
// }
//
// 예:
// bleed: [
//   "card_identity_faust_lcb_01",
//   "card_identity_don_quixote_blade_02"
// ]
//
// 의미:
// - 위 카드들이 manualDeckCards 안에 들어가 있으면
//   bleed 카운트가 올라감
// - bleed 카운트가 1 이상이면
//   card_keyword_bleed 가 화면에 표시됨
//
// 중요:
// - 카드 객체 본문에 keywordLinks를 넣지 않고,
//   여기서 "키워드 중심"으로 관리함
// - 나중에 어떤 카드가 어느 키워드인지 바꾸고 싶으면
//   이 매핑만 수정하면 됨
// ========================================
// ========================================
// 키워드 소스 카드 매핑
// ----------------------------------------
// 구조:
// {
//   키워드ID: [그 키워드를 부여하는 카드ID들]
// }
//
// 중요:
// - 카드 객체 본문에 키워드를 직접 넣지 않고
//   여기서 "키워드 중심"으로 관리함
// - 어떤 카드가 어느 키워드인지 바꾸고 싶으면
//   이 매핑만 수정하면 됨
//
// 카드 ID 규칙 참고:
// 1) 수감자 고유 카드
//    card_base_[sinnerId]_[번호2자리]
//
// 2) 인격 카드
//    card_identity_[identityId]_[번호2자리]
//
// 예:
// card_base_don_quixote_08
// card_identity_faust_seven_south_01
// ========================================
const keywordSourceMap = {
  // =========================
  // 진동
  // =========================
  tremor: [
    // 동부 엄지 뫼르소 1, 2, 3
    "card_identity_meursault_thumb_east_01",
    "card_identity_meursault_thumb_east_02",
    "card_identity_meursault_thumb_east_03",

    // 점묘파 이상 1, 2, 3
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // =========================
  // 출혈
  // =========================
  bleed: [
    // 료슈 고유 카드 8
    "card_base_ryoshu_08",

    // 로쟈 고유 카드 1
    "card_base_rodion_01",

    // 라만차 랜드 로쟈 1, 2
    "card_identity_rodion_lamancha_01",
    "card_identity_rodion_lamancha_02",

    // 점묘파 이상 1, 2, 3
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // =========================
  // 침잠
  // =========================
  sinking: [
    // 여우비 히스클리프 3
    "card_identity_heathcliff_fox_rain_03",

    // 점묘파 이상 1, 2, 3
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // =========================
  // 호흡
  // =========================
  poise: [
    // 동부 생크 돈키호테 1
    "card_identity_don_quixote_cinq_east_01",

    // 점묘파 이상 1, 2, 3
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // =========================
  // 화상
  // =========================
  burn: [
    // 불주먹 사무소 그레고르 1, 2, 3
    "card_identity_gregor_survivor_01",
    "card_identity_gregor_survivor_02",
    "card_identity_gregor_survivor_03"
  ],

  // =========================
  // 파열
  // =========================
  rupture: [
    // 남부 세븐 협회 파우스트 1, 3
    "card_identity_faust_seven_south_01",
    "card_identity_faust_seven_south_03"
  ],

  // =========================
  // 충전
  // =========================
  charge: [
    // 돈키호테 고유 카드 8
    "card_base_don_quixote_08",

    // W사 돈키호테 1, 2, 3
    "card_identity_don_quixote_wcorp_01",
    "card_identity_don_quixote_wcorp_02",
    "card_identity_don_quixote_wcorp_03",

    // W사 료슈 1, 3
    "card_identity_ryoshu_wcorp_01",
    "card_identity_ryoshu_wcorp_03",

    // 점묘파 이상 1, 2, 3
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ]
};