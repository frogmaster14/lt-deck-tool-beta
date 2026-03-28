// ========================================
// 인격 목록 데이터 (최소 + 단축형)
// ----------------------------------------
// 구조:
// identityData = {
//   sinnerId: [suffix, suffix, ...]
// }
//
// 실제 id 생성 규칙:
//   id = sinnerId + "_" + suffix
//
// 자동 생성되는 값:
// - image: assets/identities/${id}.png
// - personalPackId: pack_identity_${id}
//
// 예:
// ["yi_sang", "lcb"] → id = "yi_sang_lcb"
// ========================================

const identityData = {
  // 이상
  yi_sang: ["lcb", "mourning", "bullet", "ring"],
  // 파우스트
  faust: ["lcb", "gripper", "seven_south", "index"],
  // 돈키호테
  don_quixote: ["lcb", "blade", "cinq_east", "wcorp"],
  // 료슈
  ryoshu: ["lcb", "wcorp", "edgar_butler", "chef"],
  // 뫼르소
  meursault: ["lcb", "cinq_west", "thumb_east"],
  // 홍루
  hong_lu: ["lcb", "kk_boss", "rcorp_reindeer"],
  // 히스클리프
  heathcliff: ["lcb", "fox_rain", "kurokumo", "shi_south"],
  // 이스마엘
  ishmael: ["lcb", "kurokumo", "edgar_butler", "office"],
  // 로쟈
  rodion: ["lcb", "lamancha", "lobotomy"],
  // 싱클레어
  sinclair: ["grip", "lcb", "mariachi", "middle"],
  // 오티스
  outis: ["lcb", "wuthering_butler", "blade"],
  // 그레고르
  gregor: ["lcb", "zwei_south", "survivor"]
};

// ========================================
// 실제 identities 생성
// ----------------------------------------
// Object.entries → [sinnerId, suffixList]
// flatMap → 평탄화 (2중 배열 → 1차 배열)
// ========================================

const identities = Object.entries(identityData).flatMap(
  ([sinnerId, suffixList]) =>
    suffixList.map((suffix) => {
      const id = `${sinnerId}_${suffix}`;

      return {
        id,
        sinnerId,
        image: `assets/identities/${id}.png`,
        personalPackId: `pack_identity_${id}`
      };
    })
);