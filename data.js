/* ============================================================================
   MJ ATELIER — 설정 파일
   ----------------------------------------------------------------------------
   이 파일 하나만 고치면 사이트 내용이 바뀝니다.
   고친 뒤에는 index.html 을 새로고침(F5)하면 바로 반영됩니다.

   ★ 글자는 반드시 "따옴표" 안에 넣어 주세요.   예)  brandName: "MJ ATELIER",
   ★ 줄 끝의 쉼표( , )는 지우지 마세요.
   ★ // 뒤에 있는 글자는 설명(주석)이라 지워도 되고 남겨도 됩니다.
   ============================================================================ */

const MJ_DATA = {

  /* ─────────────────────────────────────────────────────────────────────
     1. 브랜드 기본 정보
     ───────────────────────────────────────────────────────────────────── */
  site: {
    brandName: "MJ ATELIER",          // 사이트 상단 로고 (영문)
    brandSub: "MJ 주얼리",             // 로고 아래 작은 글씨
    title: "MJ ATELIER | MJ 주얼리",   // 브라우저 탭 제목

    // 맨 위 공지 바 — 여러 줄을 넣고 싶으면 문장 사이에 " · " 를 넣으세요.
    noticeBar: "신규 회원 10% 할인 · 5만원 이상 무료배송 · 실버 925 / 14K 골드 plating",
    noticeBarOn: true,                // false 로 바꾸면 공지 바가 사라집니다.

    // 히어로(맨 위 큰 배너)
    hero: {
      image: "",                      // 예) "images/hero.jpg"   ← 비워두면 빈 사진 자리가 나옵니다.
      label: "MAIN BANNER",
      sizeGuide: "권장 1600 × 900",
      eyebrow: "SILVER 925 · 14K GOLD PLATING",
      title: "매일의 빛을 담는 주얼리",
      desc: "손끝에서 시작되는 작은 빛. 매일 착용해도 물들지 않는 실버 925 주얼리를 만듭니다.",
      buttonText: "컬렉션 보기"
    },

    // 배송 / 결제
    shippingFee: 3000,                // 기본 배송비
    freeShipping: 50000,              // 이 금액 이상이면 배송비 0원
    shippingNote: "5만원 이상 무료배송 · 평일 2시 이전 주문 당일 발송",

    // 무통장입금 계좌 (실제 계좌로 바꿔 주세요)
    bank: {
      bankName: "카카오뱅크",
      accountNumber: "3333-00-0000000",
      holder: "권명주"
    },

    // 문의 링크
    contact: {
      kakao: "",                      // 예) "https://open.kakao.com/o/xxxxxxx"  ← 비우면 버튼이 안내 문구로 바뀝니다.
      instagram: "",                  // 예) "https://instagram.com/mj.atelier"
      email: "",                      // 예) "mjatelier@naver.com"
      phone: ""                       // 예) "010-0000-0000"
    },

    // 카드결제 / 스마트스토어 링크 (나중에 연결)
    smartstoreUrl: "",                // 예) "https://smartstore.naver.com/mjatelier"

    // COLLECTION 사진 두 장 (가운데 큰 이미지 영역)
    collection: [
      { image: "" },                  // 예) "images/collection1.jpg"  ← 비워두면 빈 사진 자리
      { image: "" }                    // 예) "images/collection2.jpg"
    ],

    // 하단 사업자 정보 — 매장/사업자 등록 후 채워 주세요.
    footer: {
      company: "MJ ATELIER",
      owner: "권명주",
      bizNumber: "000-00-00000",
      mailOrderNumber: "제2026-인천연수-0000호",
      address: "인천광역시 연수구 송도동",
      csTime: "평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)",
      copyright: "© MJ ATELIER. ALL RIGHTS RESERVED."
    }
  },


  /* ─────────────────────────────────────────────────────────────────────
     2. 카테고리 탭 — 순서대로 화면에 나옵니다. (ALL 은 고정)
     ───────────────────────────────────────────────────────────────────── */
  categories: ["ALL", "NECKLACE", "EARRING", "RING", "BRACELET"],


  /* ─────────────────────────────────────────────────────────────────────
     3. 상품 목록
     ---------------------------------------------------------------------
     상품 하나를 복사해서 아래에 붙여넣으면 상품이 하나 늘어납니다.

       id        : 상품 고유 번호 (다른 상품과 겹치지 않게)
       name      : 영문 상품명 (카드에 크게 나옴)
       nameKo    : 한글 상품명 (작게 나옴)
       category  : "NECKLACE" / "EARRING" / "RING" / "BRACELET" 중 하나
       price     : 정가
       salePrice : 할인가 (할인 안 하면 0)
       badge     : "NEW" / "BEST" / "SALE" / "" (표시 안 함)
       shipping  : 카드에 나오는 짧은 배송 안내
       image     : 예) "images/item1.jpg"   ← 비워두면 빈 사진 자리가 나옵니다.
       photoNo   : 빈 사진 자리에 쓸 번호 (01, 02 ...)
       options   : 옵션 묶음. 필요 없으면 [] 로 비우세요.
                   값에 { name: "14K Gold Plating", add: 10000 } 처럼 쓰면
                   그 옵션을 고를 때 1만원이 더해집니다.
       desc      : 상세 모달에 나오는 설명
     ───────────────────────────────────────────────────────────────────── */
  products: [
    {
      id: "mj01",
      name: "AUBE NECKLACE",
      nameKo: "오브 네크리스",
      category: "NECKLACE",
      price: 62000,
      salePrice: 49600,
      badge: "NEW",
      shipping: "무료배송",
      image: "",
      photoNo: "01",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "길이", values: ["Short 40cm", { name: "Long 50cm", add: 5000 }] }
      ],
      desc: "가느다란 체인 위로 작은 물방울 모양의 펜던트를 올린 네크리스입니다. 목선을 따라 자연스럽게 흐르는 길이감으로 단독 착용은 물론 레이어드에도 잘 어울립니다."
    },
    {
      id: "mj02",
      name: "LUNE DROP EARRING",
      nameKo: "룬 드롭 이어링",
      category: "EARRING",
      price: 54000,
      salePrice: 0,
      badge: "BEST",
      shipping: "무료배송",
      image: "",
      photoNo: "02",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] }
      ],
      desc: "초승달을 닮은 곡선을 얇게 다듬어 만든 드롭 이어링입니다. 움직일 때마다 살짝 흔들려 빛을 반사합니다. 알레르기 걱정이 적은 실버 925 소재입니다."
    },
    {
      id: "mj03",
      name: "SEREIN RING",
      nameKo: "세랭 링",
      category: "RING",
      price: 46000,
      salePrice: 39100,
      badge: "SALE",
      shipping: "무료배송",
      image: "",
      photoNo: "03",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "사이즈", values: ["9호", "11호", "13호", "15호", "17호"] }
      ],
      desc: "손가락을 부드럽게 감싸는 납작한 밴드 링입니다. 안쪽 모서리를 둥글게 마감해 매일 껴도 편안합니다. 단독으로, 또는 두 개를 겹쳐 착용해 보세요."
    },
    {
      id: "mj04",
      name: "ONDE BRACELET",
      nameKo: "온드 브레이슬릿",
      category: "BRACELET",
      price: 58000,
      salePrice: 0,
      badge: "NEW",
      shipping: "무료배송",
      image: "",
      photoNo: "04",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "길이", values: ["16cm", "18cm"] }
      ],
      desc: "물결을 닮은 가는 체인 브레이슬릿입니다. 손목에 자연스럽게 흘러내리는 실루엣으로 시계나 다른 팔찌와 함께 착용하기 좋습니다."
    },
    {
      id: "mj05",
      name: "HALO CHAIN NECKLACE",
      nameKo: "헤일로 체인 네크리스",
      category: "NECKLACE",
      price: 72000,
      salePrice: 57600,
      badge: "SALE",
      shipping: "무료배송",
      image: "",
      photoNo: "05",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 12000 }] },
        { label: "길이", values: ["Short 40cm", { name: "Long 50cm", add: 5000 }] }
      ],
      desc: "고리 하나하나를 손으로 다듬어 연결한 체인 네크리스입니다. 두께감이 있어 티셔츠 위에 단독으로 착용해도 존재감이 살아 있습니다."
    },
    {
      id: "mj06",
      name: "PETIT PEARL EARRING",
      nameKo: "프티 펄 이어링",
      category: "EARRING",
      price: 38000,
      salePrice: 0,
      badge: "",
      shipping: "무료배송",
      image: "",
      photoNo: "06",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 8000 }] }
      ],
      desc: "작은 담수 진주를 실버 포스트에 올린 데일리 이어링입니다. 과하지 않은 크기라 출근과 모임 어디에나 편하게 착용할 수 있습니다."
    },
    {
      id: "mj07",
      name: "CIEL RING",
      nameKo: "시엘 링",
      category: "RING",
      price: 52000,
      salePrice: 0,
      badge: "BEST",
      shipping: "무료배송",
      image: "",
      photoNo: "07",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "사이즈", values: ["9호", "11호", "13호", "15호", "17호"] }
      ],
      desc: "가운데를 살짝 들어 올린 오픈 링입니다. 손가락 끝을 부드럽게 감싸 손이 길어 보이는 실루엣을 만들어 줍니다."
    },
    {
      id: "mj08",
      name: "MIROIR HOOP EARRING",
      nameKo: "미르아 후프 이어링",
      category: "EARRING",
      price: 42000,
      salePrice: 0,
      badge: "",
      shipping: "무료배송",
      image: "",
      photoNo: "08",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 8000 }] }
      ],
      desc: "얇은 원형 후프 이어링입니다. 가볍게 제작해 오래 착용해도 귀가 부담스럽지 않습니다."
    },
    {
      id: "mj09",
      name: "NOEUD BRACELET",
      nameKo: "누에 브레이슬릿",
      category: "BRACELET",
      price: 64000,
      salePrice: 54400,
      badge: "SALE",
      shipping: "무료배송",
      image: "",
      photoNo: "09",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 12000 }] },
        { label: "길이", values: ["16cm", "18cm"] }
      ],
      desc: "매듭을 연상시키는 작은 장식이 포인트인 브레이슬릿입니다. 체인 끝에 여유 조절 고리가 있어 손목 둘레에 맞게 착용할 수 있습니다."
    },
    {
      id: "mj10",
      name: "ECLAT PENDANT NECKLACE",
      nameKo: "에클라 펜던트 네크리스",
      category: "NECKLACE",
      price: 68000,
      salePrice: 0,
      badge: "",
      shipping: "무료배송",
      image: "",
      photoNo: "10",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 12000 }] },
        { label: "길이", values: ["Short 40cm", { name: "Long 50cm", add: 5000 }] }
      ],
      desc: "작은 사각 펜던트를 매끈하게 광을 낸 네크리스입니다. 빛을 받으면 은은하게 반짝여 단정한 스타일에 잘 어울립니다."
    },
    {
      id: "mj11",
      name: "TERRA BOLD RING",
      nameKo: "테라 볼드 링",
      category: "RING",
      price: 49000,
      salePrice: 0,
      badge: "NEW",
      shipping: "무료배송",
      image: "",
      photoNo: "11",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "사이즈", values: ["9호", "11호", "13호", "15호", "17호"] }
      ],
      desc: "넓고 납작한 면을 가진 볼드 링입니다. 표면을 무광으로 마감해 묵직한 느낌 없이 담백하게 착용됩니다."
    },
    {
      id: "mj12",
      name: "VAGUE CHAIN BRACELET",
      nameKo: "바그 체인 브레이슬릿",
      category: "BRACELET",
      price: 56000,
      salePrice: 47600,
      badge: "SALE",
      shipping: "무료배송",
      image: "",
      photoNo: "12",
      options: [
        { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
        { label: "길이", values: ["16cm", "18cm"] }
      ],
      desc: "굵기를 달리한 두 개의 체인을 나란히 이은 브레이슬릿입니다. 손목에서 가볍게 흔들리며 은은한 광택을 냅니다."
    }
  ],


  /* ─────────────────────────────────────────────────────────────────────
     4. 브랜드 소개 / 안내 문구 (수정 자유)
     ───────────────────────────────────────────────────────────────────── */
  brand: {
    statement: "SILVER 925 · MADE BY HAND",
    intro: "MJ ATELIER는 매일 손이 가는 주얼리를 만듭니다.",
    introSub: "과하지 않은 디자인과 오래 변하지 않는 소재로, 오늘의 옷에 자연스럽게 어울리는 작은 빛을 담았습니다.",
    points: [
      { title: "SILVER 925", desc: "은 함량 92.5%의 실버 925만 사용합니다." },
      { title: "HAND FINISHED", desc: "하나씩 손으로 다듬고 광을 내어 마감합니다." },
      { title: "SAFE PACKING", desc: "선물 포장과 함께 안전하게 발송합니다." }
    ]
  }
};

/* 이 줄은 지우지 마세요 (사이트가 데이터를 읽어가는 부분) */
window.MJ_DATA = MJ_DATA;
