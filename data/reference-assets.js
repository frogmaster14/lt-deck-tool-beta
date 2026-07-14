// 덱에 직접 들어가지 않지만 카드/가이드 화면에서 참조할 특수 자산.
// 카드 풀 데이터(CARD_SETS)와 분리해서 관리한다.

export const REFERENCE_ASSET_CATEGORIES = {
  statusCard: "상태카드",
  status: "상태",
  specialStack: "특수스택",
  stack: "스택",
  referenceCard: "참조카드",
  guide: "가이드"
};

export const REFERENCE_ASSETS = [
  {
    id: "faust_base_knowledge",
    label: "지식",
    category: "statusCard",
    owner: { sinnerId: "faust", identityKey: "base" },
    image: "assets/sinners/faust/base/unique/지식.png"
  },
  {
    id: "faust_gripper_nail_stack",
    label: "못",
    category: "specialStack",
    owner: { sinnerId: "faust", identityKey: "gripper" },
    image: "assets/sinners/faust/gripper/unique/못 ( 스택 ).png"
  },
  {
    id: "ryoshu_chef_cooking",
    label: "조리 중",
    category: "specialStack",
    owner: { sinnerId: "ryoshu", identityKey: "chef" },
    image: "assets/sinners/ryoshu/chef/unique/조리 중.png"
  },
  {
    id: "hong_lu_rcorp_reindeer_friendly_fire",
    label: "피아식별 불가",
    category: "status",
    owner: { sinnerId: "hong_lu", identityKey: "rcorp_reindeer" },
    image: "assets/sinners/hong_lu/rcorp_reindeer/unique/피아식별 불가 ( 상태 ).png"
  },
  {
    id: "ishmael_office_jjakpae",
    label: "짝패",
    category: "stack",
    owner: { sinnerId: "ishmael", identityKey: "office" },
    image: "assets/sinners/ishmael/office/unique/짝패.png"
  },
  {
    id: "ryoshu_edgar_butler_tusik_stack",
    label: "투.식.",
    category: "specialStack",
    owner: { sinnerId: "ryoshu", identityKey: "edgar_butler" },
    image: "assets/sinners/ryoshu/edgar_butler/unique/투.식. ( 스택 ).png"
  },
  {
    id: "ryoshu_edgar_butler_tusik_card",
    label: "투.식.",
    category: "referenceCard",
    owner: { sinnerId: "ryoshu", identityKey: "edgar_butler" },
    image: "assets/sinners/ryoshu/edgar_butler/unique/투.식..png"
  },
  {
    id: "ishmael_edgar_butler_tusik_stack",
    label: "투.식.",
    category: "specialStack",
    owner: { sinnerId: "ishmael", identityKey: "edgar_butler" },
    image: "assets/sinners/ishmael/edgar_butler/unique/투.식. ( 스택 ).png"
  },
  {
    id: "ishmael_edgar_butler_tusik_card",
    label: "투.식.",
    category: "referenceCard",
    owner: { sinnerId: "ishmael", identityKey: "edgar_butler" },
    image: "assets/sinners/ishmael/edgar_butler/unique/투.식..png"
  },
  {
    id: "faust_index_directives",
    label: "검지 파우스트 지령",
    category: "guide",
    owner: { sinnerId: "faust", identityKey: "index" },
    note: "검지 파우스트만 쓰는 전용 미션형 가이드 자산.",
    folders: [
      "assets/sinners/faust/index/꽃잎 지령",
      "assets/sinners/faust/index/쪽지 1",
      "assets/sinners/faust/index/쪽지 2",
      "assets/sinners/faust/index/쪾자 3"
    ]
  },
  {
    id: "sinclair_base_egg",
    label: "알",
    category: null,
    owner: { sinnerId: "sinclair", identityKey: "base" },
    note: "분류 대기.",
    image: "assets/sinners/sinclair/base/알.png"
  },
  {
    id: "outis_base_black_heart",
    label: "흑심",
    category: null,
    owner: { sinnerId: "outis", identityKey: "base" },
    note: "분류 대기.",
    image: "assets/sinners/outis/base/unique/흑심.png"
  }
];
