// ========================================
// 카드 목록 데이터
// ----------------------------------------
// 1) 수감자 고유 카드 자동 생성
// 2) 인격 전용 카드 자동 생성
//
// 현재 구조:
// - 카드 효과 설명은 이미지에 들어 있다고 가정
// - name은 내부 구분용 / 예비용
// - 최종 UI에서는 이름을 안 보이게 해도 됨
// ========================================

const cards = [];

/**
 * 수감자 고유 카드팩 자동 생성
 *
 * @param {string} sinnerId - 수감자 ID
 * @param {string} sinnerName - 수감자 이름
 * @param {number} count - 카드 종류 수
 */
function createBasePackCards(sinnerId, sinnerName, count) {
  for (let i = 1; i <= count; i++) {
    const numberText = String(i).padStart(2, "0");

    cards.push({
      id: `card_base_${sinnerId}_${numberText}`,
      packId: `pack_base_${sinnerId}_000`,
      name: `${sinnerName} 고유 카드 ${i}`,
      image: `assets/cards/base/${sinnerId}/${numberText}.png`,
      maxCopies: 2
    });
  }
}

/**
 * 인격 전용 카드팩 자동 생성
 *
 * @param {string} identityId - 인격 ID (identities.js의 id와 정확히 일치해야 함)
 * @param {string} displayName - 화면 구분용 이름
 * @param {number} count - 카드 종류 수
 */
function createIdentityPackCards(identityId, displayName, count) {
  for (let i = 1; i <= count; i++) {
    const numberText = String(i).padStart(2, "0");

    cards.push({
      id: `card_identity_${identityId}_${numberText}`,
      packId: `pack_identity_${identityId}`,
      name: `${displayName} 카드 ${i}`,
      image: `assets/cards/identity/${identityId}/${numberText}.png`,
      maxCopies: 2
    });
  }
}

// ========================================
// 수감자 고유 카드 자동 생성
// ========================================
createBasePackCards("yi_sang", "이상", 8);
createBasePackCards("faust", "파우스트", 8);
createBasePackCards("don_quixote", "돈키호테", 8);
createBasePackCards("ryoshu", "료슈", 8);
createBasePackCards("meursault", "뫼르소", 7);
createBasePackCards("hong_lu", "홍루", 7);
createBasePackCards("heathcliff", "히스클리프", 8);
createBasePackCards("ishmael", "이스마엘", 8);
createBasePackCards("rodion", "로쟈", 7);
createBasePackCards("sinclair", "싱클레어", 7);
createBasePackCards("outis", "오티스", 7);
createBasePackCards("gregor", "그레고르", 7);

// ========================================
// 인격 전용 카드 자동 생성
// ========================================

// 이상
createIdentityPackCards("yi_sang_lcb", "이상 LCB", 3);
createIdentityPackCards("yi_sang_mourning", "이상 엄숙한 애도", 3);
createIdentityPackCards("yi_sang_bullet", "이상 흉탄", 3);
createIdentityPackCards("yi_sang_ring", "이상 약지 점묘파", 3);

// 파우스트
createIdentityPackCards("faust_lcb", "파우스트 LCB", 3);
createIdentityPackCards("faust_gripper", "파우스트 쥐는 자", 3);
createIdentityPackCards("faust_seven_south", "파우스트 남부 세븐 협회", 3);
createIdentityPackCards("faust_index", "파우스트 검지 수행자", 3);

// 돈키호테
createIdentityPackCards("don_quixote_lcb", "돈키호테 LCB", 3);
createIdentityPackCards("don_quixote_blade", "돈키호테 검계살수", 3);
createIdentityPackCards("don_quixote_cinq_east", "돈키호테 동부 생크 협회", 3);
createIdentityPackCards("don_quixote_wcorp", "돈키호테 W사 3등급 정리요원", 3);

// 료슈
createIdentityPackCards("ryoshu_lcb", "료슈 LCB", 3);
createIdentityPackCards("ryoshu_wcorp", "료슈 W사 3등급 정리요원", 3);
createIdentityPackCards("ryoshu_edgar_butler", "료슈 에드가 가문 치프 버틀러", 3);
createIdentityPackCards("ryoshu_chef", "료슈 료.고.파 주방장", 3);

// 뫼르소
createIdentityPackCards("meursault_lcb", "뫼르소 LCB", 3);
createIdentityPackCards("meursault_cinq_west", "뫼르소 서부 생크 협회", 3);
createIdentityPackCards("meursault_thumb_east", "뫼르소 동부 엄지 카포", 4);

// 홍루
createIdentityPackCards("hong_lu_lcb", "홍루 LCB", 3);
createIdentityPackCards("hong_lu_kk_boss", "홍루 콩콩이파 두목", 3);
createIdentityPackCards("hong_lu_rcorp_reindeer", "홍루 R사 제 4무리 순록팀", 3);

// 히스클리프
createIdentityPackCards("heathcliff_lcb", "히스클리프 LCB", 3);
createIdentityPackCards("heathcliff_fox_rain", "히스클리프 여우비", 3);
createIdentityPackCards("heathcliff_kurokumo", "히스클리프 흑은회 와카슈", 3);
createIdentityPackCards("heathcliff_shi_south", "히스클리프 남부 시 협회 5과", 3);

// 이스마엘
createIdentityPackCards("ishmael_lcb", "이스마엘 LCB", 3);
createIdentityPackCards("ishmael_kurokumo", "이스마엘 흑운회 부조장", 3);
createIdentityPackCards("ishmael_edgar_butler", "이스마엘 에드가 가문 버틀러", 3);
createIdentityPackCards("ishmael_office", "이스마엘 정사무소 대표", 4);

// 로쟈
createIdentityPackCards("rodion_lcb", "로쟈 LCB", 3);
createIdentityPackCards("rodion_lamancha", "로쟈 라만차 랜드 공주", 4);
createIdentityPackCards("rodion_lobotomy", "로쟈 로보토미 눈물로 벼려낸 검", 6);

// 싱클레어
createIdentityPackCards("sinclair_grip", "싱클레어 쥐어들 자", 3);
createIdentityPackCards("sinclair_lcb", "싱클레어 LCB", 3);
createIdentityPackCards("sinclair_mariachi", "싱클레어 마리아치 보스", 3);
createIdentityPackCards("sinclair_middle", "싱클레어 중지 작은 아우", 3);

// 오티스
createIdentityPackCards("outis_lcb", "오티스 LCB", 3);
createIdentityPackCards("outis_wuthering_butler", "오티스 워더링 하이츠 치프 버틀러", 3);
createIdentityPackCards("outis_blade", "오티스 검계 살수", 3);

// 그레고르
createIdentityPackCards("gregor_lcb", "그레고르 LCB", 3);
createIdentityPackCards("gregor_zwei_south", "그레고르 남부 츠바이 협회 4과", 3);
createIdentityPackCards("gregor_survivor", "그레고르 불주먹 사무소 생존자", 3);