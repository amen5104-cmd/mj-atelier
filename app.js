/* ============================================================================
   MJ ATELIER — app.js
   이 파일은 사이트 동작(장바구니, 상세, 주문서)을 담당합니다.
   내용을 바꾸고 싶으면 data.js 를 고치세요. 이 파일은 보통 건드리지 않아도 됩니다.
   ============================================================================ */

(function () {
  "use strict";

  const D = window.MJ_DATA || {};
  const S = D.site || {};
  const CONTACT = S.contact || {};
  const BANK = S.bank || {};
  const FOOT = S.footer || {};
  const PRODUCTS = Array.isArray(D.products) ? D.products : [];
  const CATS = Array.isArray(D.categories) && D.categories.length ? D.categories : ["ALL"];

  /* ── 작은 도우미들 ──────────────────────────────────────────────────────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const won = (n) => (Math.round(Number(n) || 0)).toLocaleString("ko-KR") + "원";

  const esc = (v) =>
    String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const PH_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 20.4 9 12 21.4 3.6 9 12 2.6Z"/><path d="M3.6 9h16.8"/><path d="M12 2.6 8.6 9l3.4 12.4L15.4 9 12 2.6Z"/><path d="M8.6 9 12 21.4M15.4 9 12 21.4"/></svg>';

  /** 사진이 있으면 사진, 없으면 깔끔한 빈 자리 */
  function media(src, label, size) {
    if (src) {
      return '<img class="media__img" src="' + esc(src) + '" alt="' + esc(label) + '" loading="lazy">';
    }
    return (
      '<div class="ph">' + PH_ICON +
      '<span class="ph__label">' + esc(label) + "</span>" +
      (size ? '<span class="ph__size">' + esc(size) + "</span>" : "") +
      "</div>"
    );
  }

  const basePrice = (p) => (Number(p.salePrice) > 0 ? Number(p.salePrice) : Number(p.price) || 0);
  const discountRate = (p) =>
    Number(p.salePrice) > 0 && Number(p.price) > 0
      ? Math.round((1 - Number(p.salePrice) / Number(p.price)) * 100)
      : 0;

  const valObj = (v) => (typeof v === "string" ? { name: v, add: 0 } : { name: v.name, add: Number(v.add) || 0 });

  function groupDefs(p) {
    return Array.isArray(p.options) ? p.options.filter((g) => g && Array.isArray(g.values) && g.values.length) : [];
  }

  function optionAdd(p, sel) {
    let add = 0;
    groupDefs(p).forEach((g) => {
      const chosen = sel[g.label];
      if (!chosen) return;
      const found = g.values.map(valObj).find((v) => v.name === chosen);
      if (found) add += found.add;
    });
    return add;
  }

  const unitPrice = (p, sel) => basePrice(p) + optionAdd(p, sel);

  /* ── 상태 ───────────────────────────────────────────────────────────────── */
  const STORAGE_KEY = "mj-atelier-cart-v1";

  const state = {
    cart: [],
    cat: "ALL",
    limit: 8,
    sel: {},
    qty: 1,
    product: null,
    lastOrderText: "",
    lastOrder: null
  };

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter((it) => it && it.id && it.qty > 0) : [];
    } catch (e) {
      return [];
    }
  }
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {
      /* 저장 공간이 없어도 사이트는 동작합니다 */
    }
  }

  const cartCount = () => state.cart.reduce((n, it) => n + it.qty, 0);
  const cartGoods = () => state.cart.reduce((n, it) => n + it.unit * it.qty, 0);
  const shipFee = () => {
    const goods = cartGoods();
    if (!goods) return 0;
    return goods >= Number(S.freeShipping || 0) ? 0 : Number(S.shippingFee || 0);
  };
  const cartTotal = () => cartGoods() + shipFee();

  /* ── 처음 화면 채우기 ───────────────────────────────────────────────────── */
  function fillBrandText() {
    document.title = S.title || "MJ ATELIER";
    $("#brandLogo").textContent = S.brandName || "MJ ATELIER";
    $("#brandSub").textContent = S.brandSub || "";
    $("#ftLogo").textContent = S.brandName || "MJ ATELIER";

    const bar = $("#noticeBar");
    if (S.noticeBarOn === false || !S.noticeBar) {
      bar.classList.add("is-off");
    } else {
      $("#noticeText").textContent = S.noticeBar;
    }

    const hero = S.hero || {};
    $("#heroMedia").innerHTML = media(hero.image, hero.label || "MAIN BANNER", hero.sizeGuide || "권장 1600 × 900");
    const heroImg = $("#heroMedia img");
    if (heroImg) { heroImg.setAttribute("loading", "eager"); heroImg.setAttribute("fetchpriority", "high"); }
    $("#heroEyebrow").textContent = hero.eyebrow || "";
    $("#heroTitle").textContent = hero.title || "";
    $("#heroDesc").textContent = hero.desc || "";
    $("#heroBtn").textContent = hero.buttonText || "컬렉션 보기";

    const strip = $("#stripTrack");
    const words = [
      S.brandName || "MJ ATELIER",
      "SILVER 925",
      "14K GOLD PLATING",
      "HAND FINISHED",
      "FREE SHIPPING OVER " + won(S.freeShipping || 0)
    ];
    const one = words.map((w) => "<span>" + esc(w) + "</span>").join("");
    strip.innerHTML = one + one;

    $("#shopDesc").textContent = D.shopDesc || S.shippingNote || "";

    const brand = D.brand || {};
    $("#brandStatement").textContent = brand.statement || "";
    $("#brandIntro").textContent = brand.intro || "";
    $("#brandIntroSub").textContent = brand.introSub || "";
    $("#brandPoints").innerHTML = (brand.points || [])
      .map((p) => "<li><h3>" + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p></li>")
      .join("");

    const bankLine = BANK.accountNumber
      ? "입금계좌: " + esc(BANK.bankName || "") + " " + esc(BANK.accountNumber) + " (예금주 " + esc(BANK.holder || "") + ")"
      : "입금 계좌는 주문서에서 안내드립니다.";
    $("#guideBank").innerHTML = bankLine;
    $("#guideShip").textContent =
      "평일 오후 2시 이전 결제 확인 시 당일 발송됩니다. " +
      won(S.freeShipping || 0) + " 이상 주문은 배송비가 무료입니다.";

    fillFooter();
  }

  function fillFooter() {
    $("#ftShop").innerHTML = CATS.filter((c) => c !== "ALL")
      .map((c) => '<li><a href="#shop" data-cat="' + esc(c) + '">' + esc(c) + "</a></li>")
      .join("");

    const cs = [];
    if (CONTACT.phone) cs.push("<li><a href='tel:" + esc(CONTACT.phone.replace(/[^0-9+]/g, "")) + "'>" + esc(CONTACT.phone) + "</a></li>");
    if (CONTACT.kakao) cs.push("<li><a href='" + esc(CONTACT.kakao) + "' target='_blank' rel='noopener'>카카오톡 문의</a></li>");
    if (CONTACT.instagram) cs.push("<li><a href='" + esc(CONTACT.instagram) + "' target='_blank' rel='noopener'>인스타그램</a></li>");
    if (CONTACT.email) cs.push("<li><a href='mailto:" + esc(CONTACT.email) + "'>" + esc(CONTACT.email) + "</a></li>");
    cs.push("<li><span>" + esc(FOOT.csTime || "") + "</span></li>");
    $("#ftCustomer").innerHTML = cs.join("");

    const info = [];
    if (FOOT.company) info.push("<span>상호 " + esc(FOOT.company) + "</span>");
    if (FOOT.owner) info.push("<span>대표 " + esc(FOOT.owner) + "</span>");
    if (FOOT.bizNumber) info.push("<span>사업자등록번호 " + esc(FOOT.bizNumber) + "</span>");
    if (FOOT.mailOrderNumber) info.push("<span>통신판매업신고 " + esc(FOOT.mailOrderNumber) + "</span>");
    if (FOOT.address) info.push("<span>주소 " + esc(FOOT.address) + "</span>");
    if (BANK.accountNumber) info.push("<span>입금계좌 " + esc(BANK.bankName || "") + " " + esc(BANK.accountNumber) + "</span>");
    $("#ftInfo").innerHTML = info.join("");
    $("#ftCopy").textContent = FOOT.copyright || "";
  }

  /* ── 카테고리 탭 / 상품 그리드 ──────────────────────────────────────────── */
  function renderTabs() {
    $("#tabs").innerHTML = CATS.map((c) => {
      return (
        '<button class="tab' + (c === state.cat ? " is-on" : "") + '" data-cat="' + esc(c) + '" type="button" aria-pressed="' +
        (c === state.cat) + '">' + esc(c) + "</button>"
      );
    }).join("");
  }

  function currentList() {
    return state.cat === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.category === state.cat);
  }

  function cardHTML(p) {
    const rate = discountRate(p);
    const badges = [];
    if (p.badge) {
      const cls = /new/i.test(p.badge) ? "badge--new" : /sale/i.test(p.badge) ? "badge--sale" : "";
      badges.push('<span class="badge ' + cls + '">' + esc(p.badge) + "</span>");
    }
    if (rate > 0) badges.push('<span class="badge badge--sale">' + rate + "%</span>");

    return (
      '<article class="card" data-id="' + esc(p.id) + '">' +
        '<button class="card__media" type="button" data-open="' + esc(p.id) + '" aria-label="' + esc(p.name) + ' 상세 보기">' +
          media(p.image, "PRODUCT PHOTO " + (p.photoNo || ""), "권장 800 × 1000") +
          '<span class="card__badges">' + badges.join("") + "</span>" +
        "</button>" +
        '<div class="card__body">' +
          '<p class="card__cat">' + esc(p.category) + "</p>" +
          '<h3 class="card__name">' + esc(p.name) + "</h3>" +
          '<p class="card__ko">' + esc(p.nameKo || "") + "</p>" +
          '<p class="card__price"><b>' + won(basePrice(p)) + "</b>" +
            (rate > 0 ? "<s>" + won(p.price) + "</s>" : "") + "</p>" +
          (p.shipping ? '<p class="card__ship">' + esc(p.shipping) + "</p>" : "") +
        "</div>" +
      "</article>"
    );
  }

  function renderGrid() {
    const list = currentList();
    const shown = list.slice(0, state.limit);
    const grid = $("#grid");

    if (!list.length) {
      grid.innerHTML = '<p class="search__hint" style="grid-column:1/-1">이 카테고리의 상품을 준비하고 있습니다.</p>';
    } else {
      grid.innerHTML = shown.map(cardHTML).join("");
    }

    $(".more-wrap").classList.toggle("is-off", list.length <= state.limit);
    observeCards();
  }

  function observeCards() {
    const cards = $$(".card");
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    cards.forEach((c, i) => {
      c.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(c);
    });
  }

  function renderCollections() {
    const photo1 = (S.collection && S.collection[0] && S.collection[0].image) || "";
    const photo2 = (S.collection && S.collection[1] && S.collection[1].image) || "";
    const items = [
      {
        image: photo1,
        label: "COLLECTION 01",
        title: "Silver 925",
        desc: "매일 착용하는 기본, 은 함량 92.5%",
        cat: "NECKLACE"
      },
      {
        image: photo2,
        label: "COLLECTION 02",
        title: "14K Gold Plating",
        desc: "은은한 골드 톤, 데일리 포인트",
        cat: "EARRING"
      }
    ];
    $("#collectionGrid").innerHTML = items.map((it, i) =>
      '<a class="tile" href="#shop" data-cat="' + esc(it.cat) + '">' +
        media(it.image, "COLLECTION PHOTO 0" + (i + 1), "권장 1200 × 900") +
        '<span class="tile__copy"><span class="tile__label">' + esc(it.label) + "</span>" +
        '<span class="tile__title">' + esc(it.title) + "</span>" +
        '<span class="tile__desc">' + esc(it.desc) + "</span></span>" +
      "</a>"
    ).join("");
  }

  /* ── 열기/닫기 공통 ────────────────────────────────────────────────────── */
  const dim = $("#dim");
  let dimTimer = null;

  function openLayer(el) {
    clearTimeout(dimTimer);
    dim.hidden = false;
    requestAnimationFrame(() => dim.classList.add("is-on"));
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
  }

  function closeLayers() {
    ["#menuDrawer", "#cartDrawer", "#searchPanel", "#productModal", "#orderModal"].forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
    dim.classList.remove("is-on");
    clearTimeout(dimTimer);
    dimTimer = setTimeout(() => { dim.hidden = true; }, 320);
    document.body.classList.remove("lock");
    $("#menuBtn").setAttribute("aria-expanded", "false");
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ── 메뉴 드로어 ───────────────────────────────────────────────────────── */
  function renderMenu() {
    const shopLinks = [
      '<a class="menu__link" href="#shop" data-cat="ALL">ALL<small>' + PRODUCTS.length + "</small></a>"
    ].concat(
      CATS.filter((c) => c !== "ALL").map((c) => {
        const n = PRODUCTS.filter((p) => p.category === c).length;
        return '<a class="menu__link" href="#shop" data-cat="' + esc(c) + '">' + esc(c) + "<small>" + (n || "") + "</small></a>";
      })
    ).join("");

    const etc = [
      ['<a class="menu__link" href="#collection">COLLECTION</a>'],
      ['<a class="menu__link" href="#brand">BRAND</a>'],
      ['<a class="menu__link" href="#guide">주문 · 배송 안내</a>']
    ].join("");

    $("#menuNav").innerHTML =
      '<div class="menu__group"><p class="menu__group-title">SHOP</p>' + shopLinks + "</div>" +
      '<div class="menu__group"><p class="menu__group-title">ABOUT</p>' + etc + "</div>";

    const foot = [];
    if (CONTACT.kakao) foot.push('<a class="btn btn--line btn--block" href="' + esc(CONTACT.kakao) + '" target="_blank" rel="noopener">KAKAOTALK 문의</a>');
    else foot.push('<button class="btn btn--line btn--block" type="button" data-order-from-menu>주문서 작성하기</button>');
    if (CONTACT.instagram) foot.push('<a class="btn btn--text btn--block" href="' + esc(CONTACT.instagram) + '" target="_blank" rel="noopener">INSTAGRAM</a>');
    foot.push('<p style="font-size:10.5px;color:#A19B8F;line-height:1.8">' + esc(FOOT.csTime || "") + "</p>");
    $("#menuFoot").innerHTML = foot.join("");
  }

  /* ── 장바구니 ──────────────────────────────────────────────────────────── */
  function cartItemHTML(it, idx) {
    const optText = (it.opts || []).map((o) => o.label + " " + o.value).join(" / ");
    return (
      '<div class="citem" data-idx="' + idx + '">' +
        '<div class="citem__media">' + media(it.image, "PHOTO " + (it.photoNo || ""), "") + "</div>" +
        "<div>" +
          '<p class="citem__name">' + esc(it.name) + "</p>" +
          (optText ? '<p class="citem__opt">' + esc(optText) + "</p>" : "") +
          '<div class="citem__row">' +
            '<span class="stepper">' +
              '<button type="button" data-qty="-1" aria-label="수량 줄이기">−</button>' +
              "<span>" + it.qty + "</span>" +
              '<button type="button" data-qty="1" aria-label="수량 늘리기">+</button>' +
            "</span>" +
            '<span class="citem__price">' + won(it.unit * it.qty) + "</span>" +
          "</div>" +
        "</div>" +
        '<button class="citem__del" type="button" data-del aria-label="삭제">×</button>' +
      "</div>"
    );
  }

  function renderCart() {
    const n = cartCount();
    $("#cartCount").textContent = n;
    $("#cartCount").classList.toggle("is-empty", n === 0);
    $("#cartTitleCount").textContent = "(" + n + ")";

    const list = $("#cartList");
    if (!state.cart.length) {
      list.innerHTML =
        '<div class="cart__empty">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg>' +
          "<p>장바구니가 비어 있습니다.<br>마음에 드는 주얼리를 담아 보세요.</p>" +
          '<button class="btn btn--ghost" type="button" data-close style="min-width:0;padding:0 24px;height:42px">쇼핑 계속하기</button>' +
        "</div>";
    } else {
      list.innerHTML = state.cart.map(cartItemHTML).join("");
    }

    const goods = cartGoods();
    const free = Number(S.freeShipping || 0);
    const remain = Math.max(0, free - goods);

    $("#sumGoods").textContent = won(goods);
    $("#sumShip").textContent = shipFee() === 0 ? (goods ? "무료" : "0원") : won(shipFee());
    $("#sumTotal").textContent = won(cartTotal());

    $("#shipBarText").innerHTML = !goods
      ? esc(won(free)) + " 이상 구매 시 <b>무료배송</b>"
      : remain > 0
        ? "<b>" + esc(won(remain)) + "</b> 더 담으면 무료배송"
        : "<b>무료배송</b>이 적용되었습니다";
    $("#shipBarFill").style.width = free ? Math.min(100, (goods / free) * 100) + "%" : "100%";

    $("#goOrder").disabled = !state.cart.length;
  }

  function addToCart(p, sel, qty) {
    const opts = groupDefs(p).map((g) => {
      const val = sel[g.label];
      const found = g.values.map(valObj).find((v) => v.name === val);
      return { label: g.label, value: val, add: found ? found.add : 0 };
    });
    const key = p.id + "|" + opts.map((o) => o.value).join(",");
    const unit = basePrice(p) + opts.reduce((n, o) => n + o.add, 0);

    const exist = state.cart.find((it) => it.key === key);
    if (exist) exist.qty += qty;
    else
      state.cart.push({
        key: key,
        id: p.id,
        name: p.name,
        nameKo: p.nameKo || "",
        image: p.image || "",
        photoNo: p.photoNo || "",
        opts: opts,
        unit: unit,
        qty: qty
      });

    saveCart();
    renderCart();
  }

  /* ── 상품 상세 ─────────────────────────────────────────────────────────── */
  function defaultSel(p) {
    const sel = {};
    groupDefs(p).forEach((g) => { sel[g.label] = valObj(g.values[0]).name; });
    return sel;
  }

  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    state.product = p;
    state.sel = defaultSel(p);
    state.qty = 1;
    renderProduct();
    openLayer($("#productModal"));
  }

  function renderProduct() {
    const p = state.product;
    if (!p) return;
    const unitForRate = unitPrice(p, state.sel);
    const rate = Number(p.price) > 0 ? Math.max(0, Math.round((1 - unitForRate / Number(p.price)) * 100)) : 0;
    const unit = unitPrice(p, state.sel);
    const total = unit * state.qty;

    const optHTML = groupDefs(p).map((g) => {
      const values = g.values.map(valObj);
      return (
        '<div class="opt-group"><p class="opt-group__label">' + esc(g.label) + "</p>" +
        '<div class="opt-values">' +
        values.map((v) =>
          '<button class="opt' + (state.sel[g.label] === v.name ? " is-on" : "") + '" type="button" ' +
          'data-group="' + esc(g.label) + '" data-value="' + esc(v.name) + '" aria-pressed="' +
          (state.sel[g.label] === v.name) + '">' + esc(v.name) +
          (v.add ? "<small>+" + v.add.toLocaleString("ko-KR") + "원</small>" : "") +
          "</button>"
        ).join("") +
        "</div></div>"
      );
    }).join("");

    const specRows = [
      ["소재", (p.options && p.options[0] ? p.options[0].values.map(valObj).map((v) => v.name).join(" / ") : "Silver 925")],
      ["배송", S.shippingNote || ""],
      ["교환", "수령 후 7일 이내 문의 (착용 흔적·주문제작 제외)"]
    ];

    $("#productPanel").innerHTML =
      '<button class="pd__close" type="button" data-close aria-label="닫기">×</button>' +
      '<div class="pd">' +
        '<div class="pd__media">' + media(p.image, "PRODUCT PHOTO " + (p.photoNo || ""), "권장 800 × 1000") + "</div>" +
        '<div class="pd__info">' +
          '<p class="pd__cat">' + esc(p.category) + "</p>" +
          '<h2 class="pd__name">' + esc(p.name) + "</h2>" +
          '<p class="pd__ko">' + esc(p.nameKo || "") + "</p>" +
          '<p class="pd__price"><b>' + won(unit) + "</b>" +
            (rate > 0 ? "<s>" + won(p.price) + "</s><em>" + rate + "% OFF</em>" : "") +
          "</p>" +
          '<p class="pd__desc">' + esc(p.desc || "") + "</p>" +
          optHTML +
          '<div class="pd__qty"><span class="pd__qty-label">수량</span>' +
            '<span class="stepper">' +
              '<button type="button" data-pqty="-1" aria-label="수량 줄이기">−</button>' +
              "<span>" + state.qty + "</span>" +
              '<button type="button" data-pqty="1" aria-label="수량 늘리기">+</button>' +
            "</span>" +
          "</div>" +
          '<div class="pd__total"><span>합계</span><b>' + won(total) + "</b></div>" +
          '<div class="pd__actions">' +
            '<button class="btn btn--line" type="button" data-add>장바구니 담기</button>' +
            '<button class="btn btn--dark" type="button" data-buy>바로 주문하기</button>' +
          "</div>" +
          '<dl class="pd__spec">' +
            specRows.map((r) => "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>").join("") +
            (BANK.accountNumber ? "<div><dt>입금계좌</dt><dd>" + esc(BANK.bankName || "") + " " + esc(BANK.accountNumber) + "</dd></div>" : "") +
          "</dl>" +
        "</div>" +
      "</div>";
  }

  /* ── 주문서 ────────────────────────────────────────────────────────────── */
  function orderSummaryHTML() {
    const rows = state.cart.map((it) => {
      const opt = (it.opts || []).map((o) => o.label + " " + o.value).join(" / ");
      return (
        "<li><span>" + esc(it.name) + " × " + it.qty +
        (opt ? "<em>" + esc(opt) + "</em>" : "") + "</span><b>" + won(it.unit * it.qty) + "</b></li>"
      );
    }).join("");

    return (
      '<div class="order__sum"><h3>주문 상품</h3><ul>' + rows + "</ul>" +
        "<dl>" +
          "<div><dt>상품 합계</dt><dd>" + won(cartGoods()) + "</dd></div>" +
          "<div><dt>배송비</dt><dd>" + (shipFee() === 0 ? "무료" : won(shipFee())) + "</dd></div>" +
          '<div class="total"><dt>총 결제금액</dt><dd>' + won(cartTotal()) + "</dd></div>" +
        "</dl></div>"
    );
  }

  function openOrder() {
    if (!state.cart.length) {
      toast("장바구니에 담긴 상품이 없습니다.");
      return;
    }
    state.lastOrderText = "";
    state.lastOrder = null;

    $("#orderBody").innerHTML =
      orderSummaryHTML() +
      '<form class="order__form" id="orderForm" novalidate>' +
        '<div class="field"><label for="fName">주문자 성함 *</label><input id="fName" name="name" type="text" placeholder="홍길동" autocomplete="name"><p class="field__err">성함을 입력해 주세요.</p></div>' +
        '<div class="field"><label for="fPhone">연락처 *</label><input id="fPhone" name="phone" type="tel" placeholder="010-0000-0000" autocomplete="tel"><p class="field__err">연락처를 입력해 주세요.</p></div>' +
        '<div class="field"><label for="fDepositor">입금자명</label><input id="fDepositor" name="depositor" type="text" placeholder="주문자와 같으면 비워두세요"></div>' +
        '<div class="field"><label for="fZip">우편번호</label><input id="fZip" name="zip" type="text" inputmode="numeric" placeholder="선택 입력"></div>' +
        '<div class="field full"><label for="fAddr">주소 *</label><input id="fAddr" name="address" type="text" placeholder="도로명 주소와 상세 주소" autocomplete="street-address"><p class="field__err">주소를 입력해 주세요.</p></div>' +
        '<div class="field full"><label for="fMemo">요청 사항</label><textarea id="fMemo" name="memo" placeholder="각인, 포장, 배송 요청 등을 적어 주세요"></textarea></div>' +
      "</form>" +
      '<div class="pay">' +
        '<div class="pay__box"><span><b>무통장입금</b>으로 주문됩니다.<br>' +
          esc(BANK.bankName || "은행") + " " + esc(BANK.accountNumber || "계좌번호") + " (예금주 " + esc(BANK.holder || "") + ")<br>" +
          "아래 <b>주문서 만들기</b>를 누르면 주문 내용이 정리됩니다. 그대로 복사해 카카오톡으로 보내 주세요. 확인 후 입금 안내를 드립니다.</span></div>" +
        '<div class="pay__actions">' +
          '<button class="btn btn--dark btn--block" type="button" id="makeOrder">주문서 만들기</button>' +
        "</div>" +
        '<div class="ordertxt" id="orderTextWrap" hidden><h3>주문서 내용</h3><pre id="orderText"></pre>' +
          '<div class="pay__actions" style="grid-template-columns:1fr 1fr">' +
            '<button class="btn btn--line" type="button" id="copyOrder">주문서 복사</button>' +
            '<button class="btn btn--dark" type="button" id="kakaoOrder">카카오톡으로 보내기</button>' +
          "</div>" +
        "</div>" +
        (S.smartstoreUrl
          ? '<div class="pay__alt">카드결제는 <a href="' + esc(S.smartstoreUrl) + '" target="_blank" rel="noopener">스마트스토어</a>에서도 가능합니다.</div>'
          : '<div class="pay__alt">카드결제는 준비 중입니다. 지금은 무통장입금으로 주문해 주세요.</div>') +
      "</div>";

    $("#makeOrder").addEventListener("click", makeOrderText);
    $("#copyOrder").addEventListener("click", copyOrderText);
    $("#kakaoOrder").addEventListener("click", sendKakao);
    openLayer($("#orderModal"));
  }

  function readForm() {
    const f = $("#orderForm");
    const data = {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      depositor: f.depositor.value.trim(),
      zip: f.zip.value.trim(),
      address: f.address.value.trim(),
      memo: f.memo.value.trim()
    };
    const checks = [
      ["fName", data.name],
      ["fPhone", data.phone],
      ["fAddr", data.address]
    ];
    checks.forEach(([id, val]) => {
      $("#" + id).closest(".field").classList.toggle("err", !val);
    });
    return checks.every(([, v]) => v) ? data : null;
  }

  function makeOrderText() {
    const info = readForm();
    if (!info) {
      const firstErr = $("#orderForm .field.err input");
      if (firstErr) firstErr.focus();
      toast("필수 항목을 입력해 주세요.");
      return;
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) +
      " " + pad(now.getHours()) + ":" + pad(now.getMinutes());

    const lines = [];
    lines.push("[ " + (S.brandName || "MJ ATELIER") + " 주문서 ]");
    lines.push("주문일시 : " + stamp);
    lines.push("주문자 : " + info.name + " (" + info.phone + ")");
    if (info.depositor) lines.push("입금자명 : " + info.depositor);
    lines.push("주소 : " + (info.zip ? "(" + info.zip + ") " : "") + info.address);
    if (info.memo) lines.push("요청사항 : " + info.memo);
    lines.push("");
    state.cart.forEach((it, i) => {
      const opt = (it.opts || []).map((o) => o.label + " " + o.value).join(" / ");
      lines.push((i + 1) + ". " + it.name + (it.nameKo ? " (" + it.nameKo + ")" : ""));
      if (opt) lines.push("   - " + opt);
      lines.push("   - " + won(it.unit) + " × " + it.qty + " = " + won(it.unit * it.qty));
    });
    lines.push("");
    lines.push("상품 합계 : " + won(cartGoods()));
    lines.push("배송비 : " + (shipFee() === 0 ? "무료" : won(shipFee())));
    lines.push("총 결제금액 : " + won(cartTotal()));
    lines.push("");
    lines.push("입금계좌 : " + (BANK.bankName || "") + " " + (BANK.accountNumber || "") + " (예금주 " + (BANK.holder || "") + ")");

    state.lastOrderText = lines.join("\n");
    $("#orderText").textContent = state.lastOrderText;
    $("#orderTextWrap").hidden = false;
    $("#orderTextWrap").scrollIntoView({ behavior: "smooth", block: "nearest" });
    toast("주문서가 만들어졌습니다. 복사해서 보내 주세요.");
  }

  function copyOrderText() {
    if (!state.lastOrderText) return;
    const done = () => toast("주문서가 복사되었습니다. 카카오톡에 붙여넣어 주세요.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(state.lastOrderText).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      const ta = document.createElement("textarea");
      ta.value = state.lastOrderText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("복사가 어려우면 내용을 길게 눌러 복사해 주세요."); }
      document.body.removeChild(ta);
    }
  }

  function sendKakao() {
    if (CONTACT.kakao) window.open(CONTACT.kakao, "_blank", "noopener");
    copyOrderText();
    if (!CONTACT.kakao) toast("주문서를 복사했습니다. 문자나 인스타 DM으로 보내 주세요.");
  }

  /* ── 검색 ──────────────────────────────────────────────────────────────── */
  function renderSearch(q) {
    const key = q.trim().toLowerCase();
    const box = $("#searchResults");
    const list = PRODUCTS.filter((p) => {
      const hay = (p.name + " " + (p.nameKo || "") + " " + p.category).toLowerCase();
      return !key || hay.indexOf(key) !== -1;
    }).slice(0, 12);

    box.innerHTML = list.length
      ? list.map((p) =>
          '<button class="sresult" type="button" data-open="' + esc(p.id) + '">' +
            '<span class="sresult__media">' + media(p.image, "PHOTO " + (p.photoNo || ""), "") + "</span>" +
            "<span><span class=\"sresult__name\">" + esc(p.name) + '</span><span class="sresult__ko" style="display:block">' + esc(p.nameKo || "") + "</span></span>" +
            '<span class="sresult__price">' + won(basePrice(p)) + "</span>" +
          "</button>"
        ).join("")
      : '<p class="search__hint">검색 결과가 없습니다. 다른 단어로 찾아보세요.</p>';
  }

  /* ── 이벤트 연결 ───────────────────────────────────────────────────────── */
  function initEvents() {
    // 헤더 스크롤 상태
    const hdr = $("#header");
    const onScroll = () => hdr.classList.toggle("is-solid", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 공지 닫기
    $("#noticeClose").addEventListener("click", () => {
      $("#noticeBar").classList.add("is-off");
      try { sessionStorage.setItem("mj-notice-closed", "1"); } catch (e) {}
    });
    try {
      if (sessionStorage.getItem("mj-notice-closed") === "1") {
        if (S.noticeBarOn !== false && S.noticeBar) $("#noticeText").textContent = S.noticeBar;
        $("#noticeBar").classList.add("is-off");
      }
    } catch (e) {}

    // 열기
    $("#menuBtn").addEventListener("click", () => {
      renderMenu();
      openLayer($("#menuDrawer"));
      $("#menuBtn").setAttribute("aria-expanded", "true");
    });
    $("#cartBtn").addEventListener("click", () => {
      renderCart();
      openLayer($("#cartDrawer"));
    });
    $("#searchBtn").addEventListener("click", () => {
      renderSearch("");
      openLayer($("#searchPanel"));
      setTimeout(() => $("#searchInput").focus(), 260);
    });

    // 닫기 (data-close 공통)
    document.addEventListener("click", (e) => {
      const close = e.target.closest("[data-close]");
      if (close) { closeLayers(); return; }

      const catEl = e.target.closest("[data-cat]");
      if (catEl) {
        const cat = catEl.getAttribute("data-cat");
        state.cat = cat;
        state.limit = 8;
        renderTabs();
        renderGrid();
        closeLayers();
        const shop = $("#shop");
        const y = shop.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 0);
        window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }

      const openEl = e.target.closest("[data-open]");
      if (openEl) {
        const id = openEl.getAttribute("data-open");
        closeLayers();
        setTimeout(() => openProduct(id), 240);
        return;
      }

      if (e.target.closest("[data-close-order]")) { closeLayers(); return; }
      if (e.target.closest("[data-order-from-menu]")) { closeLayers(); setTimeout(openOrder, 200); }
    });

    dim.addEventListener("click", closeLayers);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLayers();
    });

    // 탭 / 더보기
    $("#moreBtn").addEventListener("click", () => {
      state.limit = PRODUCTS.length;
      renderGrid();
    });

    // 상품 상세 안에서의 조작
    $("#productPanel").addEventListener("click", (e) => {
      const optBtn = e.target.closest(".opt");
      if (optBtn) {
        state.sel[optBtn.getAttribute("data-group")] = optBtn.getAttribute("data-value");
        renderProduct();
        return;
      }
      const q = e.target.closest("[data-pqty]");
      if (q) {
        state.qty = Math.max(1, Math.min(99, state.qty + Number(q.getAttribute("data-pqty"))));
        renderProduct();
        return;
      }
      if (e.target.closest("[data-add]")) {
        addToCart(state.product, state.sel, state.qty);
        toast("장바구니에 담았습니다.");
        closeLayers();
        setTimeout(() => { renderCart(); openLayer($("#cartDrawer")); }, 240);
        return;
      }
      if (e.target.closest("[data-buy]")) {
        addToCart(state.product, state.sel, state.qty);
        closeLayers();
        setTimeout(openOrder, 240);
      }
    });

    // 장바구니 안에서의 조작
    $("#cartList").addEventListener("click", (e) => {
      const row = e.target.closest(".citem");
      if (!row) return;
      const idx = Number(row.getAttribute("data-idx"));
      const item = state.cart[idx];
      if (!item) return;

      if (e.target.closest("[data-del]")) {
        state.cart.splice(idx, 1);
        saveCart();
        renderCart();
        return;
      }
      const q = e.target.closest("[data-qty]");
      if (q) {
        item.qty = Math.max(1, Math.min(99, item.qty + Number(q.getAttribute("data-qty"))));
        saveCart();
        renderCart();
      }
    });

    $("#goOrder").addEventListener("click", () => {
      closeLayers();
      setTimeout(openOrder, 220);
    });
    $("#continueShop").addEventListener("click", closeLayers);

    // 검색 입력
    $("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));

    // 메뉴 안에서 장바구니 열기 등
    $("#menuNav").addEventListener("click", () => {
      setTimeout(closeLayers, 60);
    });

    // 바깥 영역 클릭 시 모달 닫기
    $$(".modal").forEach((m) => {
      m.addEventListener("click", (e) => { if (e.target === m) closeLayers(); });
    });

    // 히어로 버튼은 부드럽게 이동
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        if (document.body.classList.contains("lock")) closeLayers();
      });
    });
  }

  /* ── 시작 ──────────────────────────────────────────────────────────────── */
  function init() {
    state.cart = loadCart();
    fillBrandText();
    renderTabs();
    renderGrid();
    renderCollections();
    renderCart();
    renderMenu();
    initEvents();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
