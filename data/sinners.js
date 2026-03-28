// ========================================
// 수감자 목록 데이터
// ----------------------------------------
// - id: 내부 식별용 고유값 
// - image: 수감자 이미지 경로 
// - basePackId: 고유 카드팩 ID
// ========================================
const sinnerIds = [
  "yi_sang",
  "faust",
  "don_quixote",
  "ryoshu",
  "meursault",
  "hong_lu",
  "heathcliff",
  "ishmael",
  "rodion",
  "sinclair",
  "outis",
  "gregor"
];

const sinners = sinnerIds.map((id) => ({
  id,
  image: `assets/sinners/${id}.png`,
  basePackId: `pack_base_${id}_000`
}));