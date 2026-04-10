document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("prayersContainer");
  const searchInput = document.getElementById("searchInput");
  const filterButton = document.getElementById("filterButton");
  const filterMenu = document.getElementById("filterMenu");
  const prayerModal = document.getElementById("prayerModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  let allPrayers = [];
  let favoritePrayers = [];
  let currentFilter = "all";
  let currentSearch = "";

  function normalizeText(text) {
    return (text || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function getCategoryLabel(categoryId) {
    const labels = {
      marianas: "Orações Marianas",
      diarias: "Orações Diárias",
      santos: "Orações aos Santos",
      familia: "Orações da Família",
      curas: "Orações de Cura",
      emergencia: "Orações de Emergência"
    };
    return labels[categoryId] || "Oração";
  }

  function getFavoriteIds() {
    const saved = JSON.parse(localStorage.getItem("prayerFavorites")) || [];
    return saved.map(item => item.id);
  }

  function saveFavoritesByIds(ids) {
    const favoritesPayload = allPrayers
      .filter(prayer => ids.includes(prayer.id))
      .map(prayer => ({
        id: prayer.id,
        title: prayer.title,
        category: prayer.category,
        dateAdded: new Date().toISOString()
      }));

    localStorage.setItem("prayerFavorites", JSON.stringify(favoritesPayload));
  }

  async function loadPrayers() {
    try {
      const response = await fetch("../data/prayers.json");
      const data = await response.json();
      allPrayers = data.prayers || [];
      syncFavorites();
    } catch (error) {
      console.error("Erro ao carregar prayers.json:", error);
      container.innerHTML = `
        <div class="bg-card-bg rounded-xl border border-secondary/20 p-8 text-center fade-in">
          <h2 class="text-text-main text-2xl font-bold mb-2">Erro ao carregar</h2>
          <p class="text-text-secondary">Não foi possível carregar as orações favoritas.</p>
        </div>
      `;
    }
  }

  function syncFavorites() {
    const favoriteIds = getFavoriteIds();
    favoritePrayers = allPrayers.filter(prayer => favoriteIds.includes(prayer.id));
    renderPrayers();
  }

  function getFilteredPrayers() {
    return favoritePrayers.filter(prayer => {
      const matchesFilter = currentFilter === "all" || prayer.category === currentFilter;
      const text = normalizeText(`${prayer.title} ${prayer.description} ${prayer.content} ${prayer.category}`);
      const matchesSearch = !currentSearch || text.includes(normalizeText(currentSearch));
      return matchesFilter && matchesSearch;
    });
  }

  function formatPrayerContent(content) {
    return (content || "")
      .split(/\n\n+/)
      .map(paragraph => `<p class="mb-4">${paragraph.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function renderPrayers() {
    const prayers = getFilteredPrayers();

    if (!favoritePrayers.length) {
      container.innerHTML = `
        <div class="bg-card-bg rounded-xl border border-secondary/20 p-8 text-center fade-in">
          <h2 class="text-text-main text-2xl font-bold mb-2">Nenhuma oração favoritada</h2>
          <p class="text-text-secondary">Vá até a área de Orações e toque na estrela para salvar suas favoritas.</p>
        </div>
      `;
      return;
    }

    if (!prayers.length) {
      container.innerHTML = `
        <div class="bg-card-bg rounded-xl border border-secondary/20 p-8 text-center fade-in">
          <h2 class="text-text-main text-2xl font-bold mb-2">Nenhum resultado encontrado</h2>
          <p class="text-text-secondary">Tente buscar por outro termo ou mudar o filtro.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = prayers.map(prayer => `
      <div class="flex flex-col gap-4 p-6 bg-card-bg rounded-xl border border-secondary/20 shadow-sm card-hover fade-in" data-category="${prayer.category}" data-prayer-id="${prayer.id}">
        <div class="flex flex-col gap-1">
          <p class="text-text-secondary text-sm font-medium leading-normal">${getCategoryLabel(prayer.category)}</p>
          <p class="text-text-main text-lg font-bold leading-tight">${prayer.title}</p>
          <p class="text-text-secondary text-sm font-normal leading-normal mt-1">${prayer.description || ""}</p>
        </div>

        <div class="flex items-center gap-2 mt-auto">
          <button class="view-prayer flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:opacity-90 transition-opacity" data-prayer-id="${prayer.id}">
            <span>Ver Oração</span>
          </button>

          <button class="favorite-toggle flex items-center justify-center size-9 bg-card-bg text-primary border border-primary/50 rounded-lg hover:bg-primary/10 transition-colors" title="Remover dos favoritos" aria-label="Remover ${prayer.title} dos favoritos" data-prayer-id="${prayer.id}">
            <span class="material-symbols-outlined fill-icon">favorite</span>
          </button>
        </div>
      </div>
    `).join("");

    bindDynamicEvents();
  }

  function bindDynamicEvents() {
    container.querySelectorAll(".view-prayer").forEach(button => {
      button.addEventListener("click", function () {
        const prayerId = Number(this.dataset.prayerId);
        const prayer = allPrayers.find(item => item.id === prayerId);
        if (!prayer) return;

        modalTitle.textContent = prayer.title;
        modalContent.innerHTML = `
          <p class="text-text-secondary text-sm mb-4">${getCategoryLabel(prayer.category)}</p>
          ${formatPrayerContent(prayer.content)}
        `;
        prayerModal.classList.remove("hidden");
      });
    });

    container.querySelectorAll(".favorite-toggle").forEach(button => {
      button.addEventListener("click", function () {
        const prayerId = Number(this.dataset.prayerId);
        const favoriteIds = getFavoriteIds().filter(id => id !== prayerId);
        saveFavoritesByIds(favoriteIds);
        syncFavorites();
      });
    });
  }

  if (filterButton && filterMenu) {
    filterButton.addEventListener("click", function () {
      filterMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
      if (!filterButton.contains(event.target) && !filterMenu.contains(event.target)) {
        filterMenu.classList.add("hidden");
      }
    });

    filterMenu.querySelectorAll("button[data-filter]").forEach(button => {
      button.addEventListener("click", function () {
        currentFilter = this.dataset.filter;

        filterMenu.querySelectorAll("button[data-filter]").forEach(btn => {
          const icon = btn.querySelector(".material-symbols-outlined");
          if (icon) icon.textContent = "check_box_outline_blank";
        });

        const icon = this.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = "check_box";

        filterMenu.classList.add("hidden");
        renderPrayers();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentSearch = this.value || "";
      renderPrayers();
    });
  }

  function closePrayerModal() {
    prayerModal.classList.add("hidden");
  }

  if (closeModal) closeModal.addEventListener("click", closePrayerModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closePrayerModal);
  if (prayerModal) {
    prayerModal.addEventListener("click", function (event) {
      if (event.target === prayerModal) closePrayerModal();
    });
  }

  await loadPrayers();
});
