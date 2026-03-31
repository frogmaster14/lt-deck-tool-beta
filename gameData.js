// ========================================
// 림버스 덱 빌더 통합 데이터 파일
// ----------------------------------------
// 포함:
// - 수감자 데이터
// - 인격 데이터
// - 카드 자동 생성
// - 인격 자동추가 카드
// - 수감자 고유팩 자동추가 카드
// - 키워드 카드
// - 키워드 소스 카드 매핑
// ========================================

// ========================================
// 1. 원본 데이터 (직접 수정용)
// ----------------------------------------
// baseCount     : 수감자 고유 카드 수
// baseAutoCount : 수감자 고유팩 자동추가 카드 수
//
// identities:
// - cardCount : 인격 일반 카드 수
// - autoCount : 인격 자동추가 카드 수
//
// 자동추가 카드 이미지 경로:
// 1) 수감자 고유팩 자동카드
//    assets/cards/special/base/[sinnerId]/[번호].png
//
// 2) 인격 자동카드
//    assets/cards/special/identity/[identityId]/[번호].png
// ========================================
const LIMBUS_DATA = {
  sinners: {
    // 이상
    yi_sang: {
      baseCount: 8,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        mourning: { cardCount: 3, autoCount: 2 },
        bullet: { cardCount: 3, autoCount: 1 },
        ring: { cardCount: 3, autoCount: 0 }
      }
    },

    // 파우스트
    faust: {
      baseCount: 8,
      baseAutoCount: 1,
      identities: {
        lcb: { cardCount: 3, autoCount: 1 },
        gripper: { cardCount: 3, autoCount: 1 },
        seven_south: { cardCount: 3, autoCount: 0 },
        index: { cardCount: 3, autoCount: 2 }
      }
    },

    // 돈키호테
    don_quixote: {
      baseCount: 8,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        blade: { cardCount: 3, autoCount: 0 },
        cinq_east: { cardCount: 3, autoCount: 1 },
        wcorp: { cardCount: 3, autoCount: 1 }
      }
    },

    // 료슈
    ryoshu: {
      baseCount: 8,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 1 },
        wcorp: { cardCount: 3, autoCount: 0 },
        edgar_butler: { cardCount: 3, autoCount: 2 },
        chef: { cardCount: 3, autoCount: 2 }
      }
    },

    // 뫼르소
    meursault: {
      baseCount: 7,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 1 },
        cinq_west: { cardCount: 3, autoCount: 1 },
        thumb_east: { cardCount: 4, autoCount: 4 },
        dead_rabbits: { cardCount: 3, autoCount: 0 }
      }
    },

    // 홍루
    hong_lu: {
      baseCount: 7,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        kk_boss: { cardCount: 3, autoCount: 0 },
        rcorp_reindeer: { cardCount: 3, autoCount: 1 }
      }
    },

    // 히스클리프
    heathcliff: {
      baseCount: 8,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        fox_rain: { cardCount: 3, autoCount: 2 },
        kurokumo: { cardCount: 3, autoCount: 1 },
        shi_south: { cardCount: 3, autoCount: 0 }
      }
    },

    // 이스마엘
    ishmael: {
      baseCount: 8,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        kurokumo: { cardCount: 3, autoCount: 1 },
        edgar_butler: { cardCount: 3, autoCount: 2 },
        office: { cardCount: 4, autoCount: 1 }
      }
    },

    // 로쟈
    rodion: {
      baseCount: 7,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        lamancha: { cardCount: 4, autoCount: 3 },
        lobotomy: { cardCount: 6, autoCount: 2 },
        liu: { cardCount: 3, autoCount: 0 }
      }
    },

    // 싱클레어
    sinclair: {
      baseCount: 7,
      baseAutoCount: 0,
      identities: {
        grip: { cardCount: 3, autoCount: 1 },
        lcb: { cardCount: 3, autoCount: 0 },
        mariachi: { cardCount: 3, autoCount: 1 },
        middle: { cardCount: 3, autoCount: 2 }
      }
    },

    // 오티스
    outis: {
      baseCount: 7,
      baseAutoCount: 1,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        wuthering_butler: { cardCount: 3, autoCount: 1 },
        blade: { cardCount: 3, autoCount: 0 },
        molars: { cardCount: 3, autoCount: 0 }
      }
    },

    // 그레고르
    gregor: {
      baseCount: 7,
      baseAutoCount: 0,
      identities: {
        lcb: { cardCount: 3, autoCount: 0 },
        zwei_south: { cardCount: 3, autoCount: 2 },
        survivor: { cardCount: 3, autoCount: 2 }
      }
    }
  }
};

// ========================================
// 2. script.js 호환용 자동 생성 결과
// ========================================
const sinners = [];
const identities = [];
const cards = [];

const basePackData = [];
const identityPackData = [];
const baseAutoPackData = [];

// ========================================
// 3. 카드 자동 생성 함수
// ========================================
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

function createBaseAutoCards(sinnerId, autoCount = 0) {
  for (let i = 1; i <= autoCount; i++) {
    cards.push({
      id: `card_special_base_${sinnerId}_${i}`,
      image: `assets/cards/special/base/${sinnerId}/${i}.png`
    });
  }
}

function createIdentityAutoCards(sinnerId, suffix, autoCount = 0) {
  const identityId = `${sinnerId}_${suffix}`;

  for (let i = 1; i <= autoCount; i++) {
    cards.push({
      id: `card_special_identity_${identityId}_${i}`,
      image: `assets/cards/special/identity/${sinnerId}/${suffix}/${i}.png`
    });
  }
}

// ========================================
// 4. 수감자 / 인격 / 카드 자동 생성
// ========================================
Object.entries(LIMBUS_DATA.sinners).forEach(([sinnerId, sinnerData]) => {
  const baseCount = sinnerData.baseCount ?? 0;
  const baseAutoCount = sinnerData.baseAutoCount ?? 0;

  sinners.push({
    id: sinnerId,
    image: `assets/sinners/${sinnerId}.png`,
    basePackId: `pack_base_${sinnerId}_000`
  });

  basePackData.push([sinnerId, baseCount]);
  baseAutoPackData.push([sinnerId, baseAutoCount]);

  createBasePackCards(sinnerId, baseCount);
  createBaseAutoCards(sinnerId, baseAutoCount);

  Object.entries(sinnerData.identities).forEach(([suffix, identityInfo]) => {
    const identityId = `${sinnerId}_${suffix}`;
    const cardCount = identityInfo.cardCount ?? 0;
    const autoCount = identityInfo.autoCount ?? 0;

    identities.push({
      id: identityId,
      sinnerId,
      image: `assets/identities/${identityId}.png`
    });

    identityPackData.push([identityId, cardCount, autoCount]);

    createIdentityPackCards(identityId, cardCount);
    createIdentityAutoCards(sinnerId, suffix, autoCount);
  });
});

// ========================================
// 5. 키워드 카드 7종 자동 등록
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
    keywordId,
    image: `assets/cards/keyword/${keywordId}.png`
  });
});

// ========================================
// 6. 키워드 소스 카드 매핑
// ----------------------------------------
// 구조:
// {
//   키워드ID: [그 키워드를 부여하는 카드ID들]
// }
// ========================================
const keywordSourceMap = {
  // 진동
  tremor: [
    "card_identity_meursault_thumb_east_01",
    "card_identity_meursault_thumb_east_02",
    "card_identity_meursault_thumb_east_03",
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // 출혈
  bleed: [
    "card_base_ryoshu_08",
    "card_base_rodion_01",
    "card_identity_rodion_lamancha_01",
    "card_identity_rodion_lamancha_02",
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // 침잠
  sinking: [
    "card_identity_heathcliff_fox_rain_03",
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // 호흡
  poise: [
    "card_identity_don_quixote_cinq_east_01",
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ],

  // 화상
  burn: [
    "card_identity_gregor_survivor_01",
    "card_identity_gregor_survivor_02",
    "card_identity_gregor_survivor_03"
  ],

  // 파열
  rupture: [
    "card_identity_faust_seven_south_01",
    "card_identity_faust_seven_south_03"
  ],

  // 충전
  charge: [
    "card_base_don_quixote_08",
    "card_identity_don_quixote_wcorp_01",
    "card_identity_don_quixote_wcorp_02",
    "card_identity_don_quixote_wcorp_03",
    "card_identity_ryoshu_wcorp_01",
    "card_identity_ryoshu_wcorp_03",
    "card_identity_yi_sang_ring_01",
    "card_identity_yi_sang_ring_02",
    "card_identity_yi_sang_ring_03"
  ]
};