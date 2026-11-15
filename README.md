# MJ ATELIER — 온라인 마켓 사용 설명서

MJ 주얼리(MJ ATELIER)의 온라인 판매 페이지입니다.
**사진은 비워 두었습니다.** 명주 님이 찍은 사진을 넣으면 바로 채워집니다.

---

## 1. 어떻게 열어 보나요?

1. `mj-atelier` 폴더에서 **`index.html` 파일을 더블클릭**하면 브라우저에 열립니다.
2. 인터넷에 올린 주소(예: `https://amen5104-cmd.github.io/mj-atelier/`)로도 볼 수 있습니다.
3. 휴대폰에서 보려면 위 주소를 카카오톡으로 나에게 보내서 눌러 보세요.

> 고친 내용은 **새로고침(F5)** 하면 바로 보입니다.

---

## 2. 폴더 안에 뭐가 있나요?

```
mj-atelier/
├── index.html   ← 페이지 뼈대 (거의 건드릴 일 없음)
├── styles.css   ← 디자인/색상
├── data.js      ← ★ 여기만 고치면 됩니다 (상품, 가격, 계좌, 문의 링크)
├── app.js       ← 장바구니·주문서 동작 (건드릴 일 없음)
├── images/      ← ★ 사진을 넣는 폴더 (직접 만들어 주세요)
└── README.md    ← 이 설명서
```

---

## 3. 사진 넣는 법 (제일 먼저 할 일)

1. `mj-atelier` 폴더 안에 **`images`** 라는 이름으로 폴더를 하나 만듭니다.
2. 사진 파일을 정해진 이름으로 넣습니다.

| 사진 | 파일 이름 | 권장 크기 |
|---|---|---|
| 맨 위 큰 배너 | `images/hero.jpg` | 1600 × 900 |
| 컬렉션 사진 1 | `images/collection1.jpg` | 1200 × 900 |
| 컬렉션 사진 2 | `images/collection2.jpg` | 1200 × 900 |
| 1번 상품 | `images/item1.jpg` | 800 × 1000 (세로) |
| 2번 상품 | `images/item2.jpg` | 800 × 1000 |
| … 12번 상품 | `images/item12.jpg` | 800 × 1000 |

3. `data.js`를 열어 사진 경로를 적어 줍니다.

```js
// 맨 위 배너
hero: {
  image: "images/hero.jpg",   ← 따옴표 안에 이렇게 적습니다
  ...
}

// 상품 (data.js 아래쪽 products 안)
{
  id: "mj01",
  image: "images/item1.jpg",  ← 이 줄에 적습니다
  ...
}

// 컬렉션
collection: [
  { image: "images/collection1.jpg" },
  { image: "images/collection2.jpg" }
],
```

> 경로를 **비워 두면**(`""`) 예전처럼 빈 사진 자리가 그대로 나옵니다.
> 사진을 잘못 적으면 빈 자리가 나오니, 파일 이름의 대소문자와 확장자(`.jpg`, `.png`)를 꼭 확인하세요.

**사진 찍는 요령**
- 밝은 자연광에서, 흰 종이나 베이지 천 위에 제품만 놓고 찍으면 가장 깔끔합니다.
- 세로 사진(4:5 비율)이 카드와 가장 잘 맞습니다.
- 휴대폰 사진 그대로도 충분합니다. 용량이 크면 https://squoosh.app 에서 80% 정도로 줄이면 빨라집니다.

---

## 4. 상품 고치기 (`data.js` → `products`)

상품 하나는 이렇게 생겼습니다.

```js
{
  id: "mj01",                  // 상품 번호 (다른 상품과 겹치면 안 됩니다)
  name: "AUBE NECKLACE",       // 영문 이름 (카드에 크게)
  nameKo: "오브 네크리스",      // 한글 이름 (작게)
  category: "NECKLACE",        // NECKLACE / EARRING / RING / BRACELET
  price: 62000,                // 정가
  salePrice: 49600,            // 할인가 (할인 안 하면 0)
  badge: "NEW",                // NEW / BEST / SALE / "" (표시 안 함)
  shipping: "무료배송",         // 카드에 나오는 배송 문구
  image: "images/item1.jpg",   // 사진 경로
  photoNo: "01",               // 사진 없을 때 빈 자리에 쓸 번호
  options: [ ... ],            // 옵션 (소재, 길이, 사이즈)
  desc: "설명 문장"
}
```

- **상품 추가**: 상품 하나를 통째로 복사해서 아래에 붙여넣고 `id`와 이름을 바꿔 주세요.
- **상품 삭제**: 그 상품 블록(`{` 부터 `},` 까지)을 지우면 됩니다.
- **품절/숨김**: 지우는 게 제일 간단합니다.
- **가격 표시**: `62,000원` 처럼 자동으로 쉼표가 들어갑니다. 숫자만 적으세요.

### 옵션 (소재 / 길이 / 사이즈)

```js
options: [
  { label: "소재", values: ["Silver 925", { name: "14K Gold Plating", add: 10000 }] },
  { label: "길이", values: ["Short 40cm", { name: "Long 50cm", add: 5000 }] }
]
```

- `{ name: "14K Gold Plating", add: 10000 }` → 그 옵션을 고르면 **1만원이 더해집니다**.
- 그냥 `"Silver 925"` 처럼 적으면 추가 금액 없이 선택만 됩니다.
- 옵션이 필요 없으면 `options: []` 로 비우세요.

---

## 5. 계좌·문의 링크 넣기 (실제 판매 전 필수)

`data.js` 맨 위쪽 `site` 안에서 고칩니다.

```js
bank: {
  bankName: "카카오뱅크",
  accountNumber: "3333-00-0000000",   ← 실제 계좌번호로
  holder: "권명주"                     ← 예금주
},

contact: {
  kakao: "https://open.kakao.com/o/xxxxxxx",   ← 카카오톡 채널 주소
  instagram: "https://instagram.com/....",     ← 인스타그램 주소
  email: "내메일@naver.com",
  phone: "010-0000-0000"
},

smartstoreUrl: "",   ← 스마트스토어 주소가 생기면 여기에 (카드결제 안내가 생깁니다)
```

**카카오톡 채널 주소 얻는 법**
1. 카카오톡 채널 관리자센터(https://center-pf.kakao.com)에서 채널을 만듭니다.
2. 채널 홈 주소(`https://pf.kakao.com/_xxxxx`)를 복사해 `kakao:` 에 넣습니다.
3. 또는 카카오톡 채널의 **1:1 채팅 링크**를 넣어도 됩니다.

---

## 6. 배송비·공지 바

```js
shippingFee: 3000,               // 기본 배송비
freeShipping: 50000,             // 5만원 이상 무료 (0으로 하면 항상 무료 기준 없음)
shippingNote: "5만원 이상 무료배송 · 평일 2시 이전 주문 당일 발송",

noticeBar: "신규 회원 10% 할인 · 5만원 이상 무료배송",   // 맨 위 검은 띠 문구
noticeBarOn: true,               // false 로 바꾸면 띠가 사라집니다

// SHOP 제목 아래 한 줄 소개 (categories 아래에 있습니다)
shopDesc: "매일 손이 가는 주얼리. 실버 925와 14K 골드 plating으로 마감했습니다.",
```

---

## 7. 하단 사업자 정보

```js
footer: {
  company: "MJ ATELIER",
  owner: "권명주",
  bizNumber: "000-00-00000",           ← 사업자등록번호
  mailOrderNumber: "제2026-인천연수-0000호",  ← 통신판매업 신고번호
  address: "인천광역시 연수구 송도동",
  csTime: "평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)",
  copyright: "© MJ ATELIER. ALL RIGHTS RESERVED."
}
```

> 사업자등록 전이라면 비워 두어도 화면은 정상입니다. 다만 **실제로 물건을 팔 때는 사업자등록과 통신판매업 신고**가 필요합니다(간이과세자도 신고 대상).

---

## 8. 색상·글자 톤 바꾸기 (`styles.css` 맨 위)

```css
:root{
  --off:      #FAF9F6;   /* 배경 */
  --stone:    #F2EFE9;   /* 사진 자리 */
  --charcoal: #1A1A1A;   /* 글자·버튼 */
  --gold:     #9A7B4F;   /* 포인트 (살짝 더 진하게 쓰고 싶으면 #8A6B3F) */
}
```

값만 바꾸면 사이트 전체 색이 함께 바뀝니다.

---

## 9. 손님은 이렇게 주문합니다

1. 상품을 눌러 **소재·길이·사이즈**를 고르고 장바구니에 담습니다.
2. 오른쪽 위 가방 아이콘 → **주문하기**.
3. 성함·연락처·주소를 적고 **주문서 만들기**를 누릅니다.
4. **주문서 복사** → 카카오톡(또는 문자)에 붙여넣어 보냅니다.
5. 명주 님이 입금을 확인하고 발송합니다.

> 장바구니에 담은 상품은 그 휴대폰에 저장되어, 창을 닫아도 남아 있습니다.

---

## 10. 처음 올릴 때 체크리스트

- [ ] `images/` 폴더에 사진 넣고 `data.js`에 경로 적기
- [ ] 상품 이름·가격 실제 값으로 바꾸기
- [ ] 계좌번호·예금주 실제 값으로 바꾸기
- [ ] 카카오톡 채널 주소 넣기
- [ ] 사업자 정보(있으면) 채우기
- [ ] 휴대폰에서 열어서 글자 깨짐·사진 비율 확인
- [ ] 주문 테스트 한 번 해보기 (내 주소로)

---

## 11. 사이트 주소 (GitHub Pages)

이 사이트는 GitHub Pages로 배포되어 있습니다.

- 주소: `https://amen5104-cmd.github.io/mj-atelier/`
- 저장소: `https://github.com/amen5104-cmd/mj-atelier`

> 주소를 열었을 때 404가 나오면 저장소 → **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save** 를 한 번만 눌러 주세요. 1~2분 뒤 열립니다.

**수정한 내용을 다시 올리는 법** (컴퓨터에서)
```bash
cd mj-atelier
git add .
git commit -m "사진 추가"
git push
```
올린 뒤 1~2분이 지나면 주소에 반영됩니다.

> 나중에 `mjatelier.com` 같은 내 도메인을 쓰고 싶다면 GitHub 저장소 Settings → Pages → Custom domain 에서 연결할 수 있습니다.
