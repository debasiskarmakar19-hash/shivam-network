/* Dedicated Android app navigation for Shivam Network. */
(function () {
  "use strict";
  const isApp = () => document.documentElement.classList.contains("app-mode");
  const navItems = () => document.querySelectorAll(".app-nav-item");
  const activate = (id) => {
    navItems().forEach((item) => item.classList.remove("active"));
    document.getElementById(id)?.classList.add("active");
  };
  const clearPageModes = () => document.body.classList.remove("app-page-category", "app-page-products", "app-page-orders", "app-account-detail");
  function ensureCategoryPage() {
    let page = document.getElementById("appCategoryPage");
    if (page) return page;
    page = document.createElement("section");
    page.id = "appCategoryPage";
    page.setAttribute("aria-label", "পণ্যের ক্যাটাগরি");
    page.innerHTML = '<header class="app-category-head"><button type="button" id="appCategoryBack" aria-label="হোমে ফিরুন">←</button><div><b>ক্যাটাগরি</b><small>কী কিনতে চান বেছে নিন</small></div></header><label class="app-category-search"><span>⌕</span><input id="appCategorySearch" type="search" placeholder="ক্যাটাগরি খুঁজুন…" autocomplete="off"></label><div id="appCategoryList" class="app-category-list" aria-live="polite"></div>';
    document.body.appendChild(page);
    page.querySelector("#appCategoryBack").addEventListener("click", showHome);
    page.querySelector("#appCategorySearch").addEventListener("input", renderCategoryList);
    page.querySelector("#appCategoryList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-app-category]");
      if (button) selectCategory(button.dataset.appCategory);
    });
    return page;
  }
  function renderCategoryList() {
    const root = document.getElementById("appCategoryList");
    const query = (document.getElementById("appCategorySearch")?.value || "").trim().toLocaleLowerCase();
    if (!root) return;
    const rows = [...new Set((products || []).map((p) => String(p.category || "অন্যান্য").trim() || "অন্যান্য"))]
      .sort((a, b) => a.localeCompare(b, "bn"))
      .map((name) => ({ name, count: (products || []).filter((p) => (String(p.category || "অন্যান্য").trim() || "অন্যান্য") === name).length }))
      .filter((row) => !query || row.name.toLocaleLowerCase().includes(query));
    root.innerHTML = rows.length ? rows.map((row) =>
      '<button type="button" class="app-category-row" data-app-category="' + escapeHTML(row.name) + '"><span class="app-category-icon">' + iconFor(row.name) + '</span><span class="app-category-copy"><b>' + escapeHTML(row.name) + '</b><small>' + row.count + 'টি পণ্য</small></span><span class="app-category-arrow">›</span></button>'
    ).join("") : '<div class="empty">' + ((products || []).length ? "এই নামে কোনো ক্যাটাগরি নেই।" : "এখনও কোনো পণ্য যোগ করা হয়নি।") + '</div>';
  }
  function showCategories() {
    if (!isApp()) return;
    if (appProfileOpen) window.closeCustomerAccount();
    clearPageModes();
    document.body.classList.add("app-page-category");
    activate("appCategoryNav");
    ensureCategoryPage();
    renderCategoryList();
    window.scrollTo(0, 0);
  }
  function selectCategory(name) {
    if (!isApp()) return;
    category = name;
    const search = document.getElementById("search");
    if (search) search.value = "";
    render();
    document.body.classList.remove("app-page-category");
    document.body.classList.add("app-page-products");
    const heading = document.querySelector("#products .section-head h2");
    if (heading) heading.textContent = name;
    activate("appCategoryNav");
    window.scrollTo(0, 0);
  }
  function showHome() {
    if (!isApp()) return;
    clearPageModes();
    if (appProfileOpen) window.closeCustomerAccount();
    category = "all";
    const search = document.getElementById("search");
    if (search) search.value = "";
    render();
    const heading = document.querySelector("#products .section-head h2");
    if (heading) heading.textContent = "সব মোবাইল অ্যাকসেসরিজ";
    activate("appHomeNav");
    window.scrollTo(0, 0);
  }
  function openOrders() {
    if (!isApp()) return;
    clearPageModes();
    document.body.classList.add("app-page-orders");
    window.__appPendingAccountTab = "orders";
    window.openCustomerAccount();
    if (customerAuth?.currentUser) {
      document.querySelector('[data-account-tab="orders"]')?.click();
      window.__appPendingAccountTab = "";
    }
    activate("appOrdersNav");
  }
  function openAccount() {
    if (!isApp()) return;
    clearPageModes();
    if (appProfileOpen) {
      window.closeCustomerAccount();
      activate("appHomeNav");
      return;
    }
    window.openCustomerAccount();
    activate("appAccountNav");
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (!isApp()) return;
    document.querySelector('[data-app-nav="category"]')?.addEventListener("click", function (event) {
      event.preventDefault(); showCategories();
    });
    document.querySelector('[data-app-nav="home"]')?.addEventListener("click", function (event) {
      event.preventDefault(); showHome();
    });
    document.getElementById("appOrdersNav")?.addEventListener("click", openOrders);
    document.getElementById("appAccountNav")?.addEventListener("click", openAccount);
    document.querySelector('[data-app-nav="cart"]')?.addEventListener("click", function () {
      clearPageModes();
      if (appProfileOpen) window.closeCustomerAccount();
    });
    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-account-tab]")) {
        document.body.classList.add("app-account-detail");
        document.body.classList.remove("app-page-orders");
      }
      if (event.target.closest("#accountDetailBackButton")) {
        document.body.classList.remove("app-account-detail", "app-page-orders");
        activate("appAccountNav");
      }
    });
    customerAuth?.onAuthStateChanged((user) => {
      if (!user || !window.__appPendingAccountTab) return;
      const pending = window.__appPendingAccountTab;
      window.__appPendingAccountTab = "";
      setTimeout(() => {
        if (pending === "orders" && appProfileOpen) {
          document.querySelector('[data-account-tab="orders"]')?.click();
          document.body.classList.add("app-page-orders", "app-account-detail");
          activate("appOrdersNav");
        }
      }, 250);
    });
  });
  window.openAppOrdersPage = openOrders;
})();