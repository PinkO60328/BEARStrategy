(function () {
  const cfg = window.BEARSTR || {};

  // Placeholder strings like "CommingSoon" / "0xCommingSoon" are not valid CAs.
  const ca = typeof cfg.ca === "string" ? cfg.ca : "";
  const caReady =
    ca.length >= 32 &&
    ca !== "CommingSoon" &&
    !/^0xCommingSoon$/i.test(ca) &&
    ca.toLowerCase() !== "comingsoon";

  function hideEl(el) {
    el.style.display = "none";
    el.setAttribute("aria-hidden", "true");
    el.removeAttribute("href");
  }

  function wireExternal() {
    document.querySelectorAll("[data-buy]").forEach((el) => {
      if (!caReady || !cfg.buyUrl) {
        hideEl(el);
        return;
      }
      el.href = cfg.buyUrl;
      el.style.display = "";
      el.removeAttribute("aria-hidden");
    });
    document.querySelectorAll("[data-dashboard]").forEach((el) => {
      el.href = cfg.dashboardUrl;
    });
    document.querySelectorAll("[data-etherscan]").forEach((el) => {
      if (!caReady || !cfg.etherscanUrl) {
        hideEl(el);
        return;
      }
      el.href = cfg.etherscanUrl;
      el.style.display = "";
      el.removeAttribute("aria-hidden");
    });
    document.querySelectorAll("[data-opensea]").forEach((el) => {
      el.href = cfg.openseaUrl;
    });
  }

  function renderCa() {
    document.querySelectorAll("[data-ca]").forEach((el) => {
      el.textContent = cfg.ca;
    });
  }

  function renderHero() {
    const root = document.getElementById("hero-art");
    if (!root || !cfg.heroNfts) return;
    root.innerHTML = cfg.heroNfts
      .map(
        (src, i) =>
          `<div class="art-punk art-punk-${i}"><img src="${src}" alt="BearsOnTheBlock" width="240" height="240" ${i === 1 ? 'fetchpriority="high"' : ""} /></div>`
      )
      .join("");
  }

  function renderCollection() {
    const root = document.getElementById("collection-grid");
    if (!root || !cfg.collectionNfts) return;
    root.innerHTML = cfg.collectionNfts
      .map(
        (src, i) =>
          `<a class="collect-card" href="${cfg.openseaUrl}" target="_blank" rel="noopener noreferrer"><img src="${src}" alt="BearsOnTheBlock sample ${i + 1}" width="240" height="240" loading="lazy" /></a>`
      )
      .join("");
  }

  async function copyCa(btn) {
    try {
      await navigator.clipboard.writeText(cfg.ca);
      const prev = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = prev), 1400);
    } catch (_) {
      btn.textContent = "Failed";
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy-ca]");
    if (btn) copyCa(btn);
  });

  // Theme toggle — dark is default
  const root = document.documentElement;
  const saved = localStorage.getItem("bearstr-theme");
  if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  else root.dataset.theme = "dark";

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("bearstr-theme", next);
    });
  });

  // Mobile nav
  const sheet = document.getElementById("mobile-nav");
  document.querySelectorAll("[data-nav-open]").forEach((b) =>
    b.addEventListener("click", () => sheet?.classList.add("open"))
  );
  document.querySelectorAll("[data-nav-close]").forEach((b) =>
    b.addEventListener("click", () => sheet?.classList.remove("open"))
  );

  wireExternal();
  renderCa();
  renderHero();
  renderCollection();
})();
