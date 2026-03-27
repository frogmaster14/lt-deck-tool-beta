// ========================================
// 인격 목록 데이터
// ----------------------------------------
// - id: 인격 고유 ID
// - sinnerId: 어느 수감자 소속인지 연결
// - name: 인격 이름
// - image: 인격 이미지 경로
// - personalPackId: 이 인격 전용 카드팩 ID
// ========================================

const identities = [
  // =========================
  // 이상
  // =========================
  {
    id: "yi_sang_lcb",
    sinnerId: "yi_sang",
    name: "LCB",
    image: "assets/identities/yi_sang_lcb.png",
    personalPackId: "pack_identity_yi_sang_lcb"
  },
  {
    id: "yi_sang_mourning",
    sinnerId: "yi_sang",
    name: "엄숙한 애도",
    image: "assets/identities/yi_sang.png",
    personalPackId: "pack_identity_yi_sang_mourning"
  },
  {
    id: "yi_sang_bullet",
    sinnerId: "yi_sang",
    name: "흉탄",
    image: "assets/identities/yi_sang_bullet.png",
    personalPackId: "pack_identity_yi_sang_bullet"
  },
  {
    id: "yi_sang_ring",
    sinnerId: "yi_sang",
    name: "약지 점묘파",
    image: "assets/identities/yi_sang_ring.png",
    personalPackId: "pack_identity_yi_sang_ring"
  },

  // =========================
  // 파우스트
  // =========================
  {
    id: "faust_lcb",
    sinnerId: "faust",
    name: "LCB",
    image: "assets/identities/faust_lcb.png",
    personalPackId: "pack_identity_faust_lcb"
  },
  {
    id: "faust_gripper",
    sinnerId: "faust",
    name: "쥐는 자",
    image: "assets/identities/faust_gripper.png",
    personalPackId: "pack_identity_faust_gripper"
  },
  {
    id: "faust_seven_south",
    sinnerId: "faust",
    name: "남부 세븐 협회",
    image: "assets/identities/faust_seven_south.png",
    personalPackId: "pack_identity_faust_seven_south"
  },
  {
    id: "faust_index",
    sinnerId: "faust",
    name: "검지 수행자",
    image: "assets/identities/faust_index.png",
    personalPackId: "pack_identity_faust_index"
  },

  // =========================
  // 돈키호테
  // =========================
  {
    id: "don_quixote_lcb",
    sinnerId: "don_quixote",
    name: "LCB",
    image: "assets/identities/don_quixote_lcb.png",
    personalPackId: "pack_identity_don_quixote_lcb"
  },
  {
    id: "don_quixote_blade",
    sinnerId: "don_quixote",
    name: "검계살수",
    image: "assets/identities/don_quixote_blade.png",
    personalPackId: "pack_identity_don_quixote_blade"
  },
  {
    id: "don_quixote_cinq_east",
    sinnerId: "don_quixote",
    name: "동부 생크 협회",
    image: "assets/identities/don_quixote_cinq_east.png",
    personalPackId: "pack_identity_don_quixote_cinq_east"
  },
  {
    id: "don_quixote_wcorp",
    sinnerId: "don_quixote",
    name: "W사 3등급 정리요원",
    image: "assets/identities/don_quixote_wcorp.png",
    personalPackId: "pack_identity_don_quixote_wcorp"
  },

  // =========================
  // 료슈
  // =========================
  {
    id: "ryoshu_lcb",
    sinnerId: "ryoshu",
    name: "LCB",
    image: "assets/identities/ryoshu_lcb.png",
    personalPackId: "pack_identity_ryoshu_lcb"
  },
  {
    id: "ryoshu_wcorp",
    sinnerId: "ryoshu",
    name: "W사 3등급 정리요원",
    image: "assets/identities/ryoshu_wcorp.png",
    personalPackId: "pack_identity_ryoshu_wcorp"
  },
  {
    id: "ryoshu_edgar_butler",
    sinnerId: "ryoshu",
    name: "에드가 가문 치프 버틀러",
    image: "assets/identities/ryoshu_edgar_butler.png",
    personalPackId: "pack_identity_ryoshu_edgar_butler"
  },
  {
    id: "ryoshu_chef",
    sinnerId: "ryoshu",
    name: "료.고.파 주방장",
    image: "assets/identities/ryoshu_chef.png",
    personalPackId: "pack_identity_ryoshu_chef"
  },

  // =========================
  // 뫼르소
  // =========================
  {
    id: "meursault_lcb",
    sinnerId: "meursault",
    name: "LCB",
    image: "assets/identities/meursault_lcb.png",
    personalPackId: "pack_identity_meursault_lcb"
  },
  {
    id: "meursault_cinq_west",
    sinnerId: "meursault",
    name: "서부 생크 협회",
    image: "assets/identities/meursault_cinq_west.png",
    personalPackId: "pack_identity_meursault_cinq_west"
  },
  {
    id: "meursault_thumb_east",
    sinnerId: "meursault",
    name: "동부 엄지 카포",
    image: "assets/identities/meursault_thumb_east.png",
    personalPackId: "pack_identity_meursault_thumb_east"
  },

  // =========================
  // 홍루
  // =========================
  {
    id: "hong_lu_lcb",
    sinnerId: "hong_lu",
    name: "LCB",
    image: "assets/identities/hong_lu_lcb.png",
    personalPackId: "pack_identity_hong_lu_lcb"
  },
  {
    id: "hong_lu_kk_boss",
    sinnerId: "hong_lu",
    name: "콩콩이파 두목",
    image: "assets/identities/hong_lu_kk_boss.png",
    personalPackId: "pack_identity_hong_lu_kk_boss"
  },
  {
    id: "hong_lu_rcorp_reindeer",
    sinnerId: "hong_lu",
    name: "R사 제 4무리 순록팀",
    image: "assets/identities/hong_lu_rcorp_reindeer.png",
    personalPackId: "pack_identity_hong_lu_rcorp_reindeer"
  },

  // =========================
  // 히스클리프
  // =========================
  {
    id: "heathcliff_lcb",
    sinnerId: "heathcliff",
    name: "LCB",
    image: "assets/identities/heathcliff_lcb.png",
    personalPackId: "pack_identity_heathcliff_lcb"
  },
  {
    id: "heathcliff_fox_rain",
    sinnerId: "heathcliff",
    name: "여우비",
    image: "assets/identities/heathcliff_fox_rain.png",
    personalPackId: "pack_identity_heathcliff_fox_rain"
  },
  {
    id: "heathcliff_kurokumo",
    sinnerId: "heathcliff",
    name: "흑은회 와카슈",
    image: "assets/identities/heathcliff_kurokumo.png",
    personalPackId: "pack_identity_heathcliff_kurokumo"
  },
  {
    id: "heathcliff_shi_south",
    sinnerId: "heathcliff",
    name: "남부 시 협회 5과",
    image: "assets/identities/heathcliff_shi_south.png",
    personalPackId: "pack_identity_heathcliff_shi_south"
  },

  // =========================
  // 이스마엘
  // =========================
  {
    id: "ishmael_lcb",
    sinnerId: "ishmael",
    name: "LCB",
    image: "assets/identities/ishmael_lcb.png",
    personalPackId: "pack_identity_ishmael_lcb"
  },
  {
    id: "ishmael_kurokumo",
    sinnerId: "ishmael",
    name: "흑운회 부조장",
    image: "assets/identities/ishmael_kurokumo.png",
    personalPackId: "pack_identity_ishmael_kurokumo"
  },
  {
    id: "ishmael_edgar_butler",
    sinnerId: "ishmael",
    name: "에드가 가문 버틀러",
    image: "assets/identities/ishmael_edgar_butler.png",
    personalPackId: "pack_identity_ishmael_edgar_butler"
  },
  {
    id: "ishmael_office",
    sinnerId: "ishmael",
    name: "정사무소 대표",
    image: "assets/identities/ishmael_office.png",
    personalPackId: "pack_identity_ishmael_office"
  },

  // =========================
  // 로쟈
  // =========================
  {
    id: "rodion_lcb",
    sinnerId: "rodion",
    name: "LCB",
    image: "assets/identities/rodion_lcb.png",
    personalPackId: "pack_identity_rodion_lcb"
  },
  {
    id: "rodion_lamancha",
    sinnerId: "rodion",
    name: "라만차 랜드 공주",
    image: "assets/identities/rodion_lamancha.png",
    personalPackId: "pack_identity_rodion_lamancha"
  },
  {
    id: "rodion_lobotomy",
    sinnerId: "rodion",
    name: "로보토미 눈물로 벼려낸 검",
    image: "assets/identities/rodion_lobotomy.png",
    personalPackId: "pack_identity_rodion_lobotomy"
  },

  // =========================
  // 싱클레어
  // =========================
  {
    id: "sinclair_grip",
    sinnerId: "sinclair",
    name: "쥐어들 자",
    image: "assets/identities/sinclair_grip.png",
    personalPackId: "pack_identity_sinclair_grip"
  },
  {
    id: "sinclair_lcb",
    sinnerId: "sinclair",
    name: "LCB",
    image: "assets/identities/sinclair_lcb.png",
    personalPackId: "pack_identity_sinclair_lcb"
  },
  {
    id: "sinclair_mariachi",
    sinnerId: "sinclair",
    name: "마리아치 보스",
    image: "assets/identities/sinclair_mariachi.png",
    personalPackId: "pack_identity_sinclair_mariachi"
  },
  {
    id: "sinclair_middle",
    sinnerId: "sinclair",
    name: "중지 작은 아우",
    image: "assets/identities/sinclair_middle.png",
    personalPackId: "pack_identity_sinclair_middle"
  },

  // =========================
  // 오티스
  // =========================
  {
    id: "outis_lcb",
    sinnerId: "outis",
    name: "LCB",
    image: "assets/identities/outis_lcb.png",
    personalPackId: "pack_identity_outis_lcb"
  },
  {
    id: "outis_wuthering_butler",
    sinnerId: "outis",
    name: "워더링 하이츠 치프 버틀러",
    image: "assets/identities/outis_wuthering_butler.png",
    personalPackId: "pack_identity_outis_wuthering_butler"
  },
  {
    id: "outis_blade",
    sinnerId: "outis",
    name: "검계 살수",
    image: "assets/identities/outis_blade.png",
    personalPackId: "pack_identity_outis_blade"
  },

  // =========================
  // 그레고르
  // =========================
  {
    id: "gregor_lcb",
    sinnerId: "gregor",
    name: "LCB",
    image: "assets/identities/gregor_lcb.png",
    personalPackId: "pack_identity_gregor_lcb"
  },
  {
    id: "gregor_zwei_south",
    sinnerId: "gregor",
    name: "남부 츠바이 협회 4과",
    image: "assets/identities/gregor_zwei_south.png",
    personalPackId: "pack_identity_gregor_zwei_south"
  },
  {
    id: "gregor_survivor",
    sinnerId: "gregor",
    name: "불주먹 사무소 생존자",
    image: "assets/identities/gregor_survivor.png",
    personalPackId: "pack_identity_gregor_survivor"
  }
];