let prayersData = { categories: [], prayers: [] };

let currentState = {
  currentCategory: "marianas",
  currentPrayer: 1,
  favorites: [],
  fontSize: 18
};

document.addEventListener("DOMContentLoaded", async function () {
  const user = localStorage.getItem("loggedUser");
  if (!user) {
    window.location.href = "../FéConecta.html";
    return;
  }

  if (window.FeState) {
    FeState.applyUserToPage();
  } else {
    const userData = JSON.parse(user);
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    if (userNameElement && userData.nome) userNameElement.textContent = userData.nome;
    if (userEmailElement && userData.email) userEmailElement.textContent = userData.email;
  }

  loadAppState();
  await loadPrayersData();
  initializeInterface();
  setupEventListeners();
  setupPanelResizer();
});

async function loadPrayersData() {
  try {
    const response = await fetch("../data/prayers.json");
    prayersData = await response.json();
    if (!getCurrentPrayer() && prayersData.prayers.length) {
      currentState.currentPrayer = prayersData.prayers[0].id;
      currentState.currentCategory = prayersData.prayers[0].category;
    }
  } catch (error) {
    console.error("Erro ao carregar prayers.json:", error);
  }
}

function loadAppState() {
  const savedState = localStorage.getItem("prayerAppState");
  if (savedState) {
    try {
      currentState = { ...currentState, ...JSON.parse(savedState) };
    } catch (error) {
      console.error("Erro ao carregar estado:", error);
    }
  }

  const savedFavorites = localStorage.getItem("prayerFavorites");
  if (savedFavorites) {
    try {
      currentState.favorites = JSON.parse(savedFavorites);
    } catch (error) {
      currentState.favorites = [];
    }
  }
}

function saveAppState() {
  localStorage.setItem("prayerAppState", JSON.stringify(currentState));
  localStorage.setItem("prayerFavorites", JSON.stringify(currentState.favorites));
}

function initializeInterface() {
  renderStats();
  renderCategories();
  renderPrayerContent();
}

function renderStats() {
  const statsElement = document.getElementById("prayerStats");
  if (!statsElement) return;

  const totalPrayers = prayersData.prayers.length;
  const favoriteCount = currentState.favorites.length;

  statsElement.innerHTML = `
    <div class="flex-1 text-center">
      <div class="text-2xl font-bold text-app-highlight">${totalPrayers}</div>
      <div class="text-xs text-app-text-secondary font-semibold">Orações</div>
    </div>
    <div class="flex-1 text-center">
      <div class="text-2xl font-bold text-app-highlight">${favoriteCount}</div>
      <div class="text-xs text-app-text-secondary font-semibold">Favoritas</div>
    </div>
  `;
}

function renderCategories() {
  const categoriesContainer = document.getElementById("categoriesContent");
  if (!categoriesContainer) return;

  categoriesContainer.innerHTML = prayersData.categories.map(category => {
    const isActive = category.id === currentState.currentCategory;
    return `
      <div class="category-section">
        <div class="flex items-center justify-between gap-4 bg-app-secondary/20 px-4 py-3 border-b border-app-secondary/20">
          <div class="flex items-center gap-4 min-w-0">
            <div class="text-app-highlight flex items-center justify-center rounded-lg bg-app-highlight/20 shrink-0 size-10" style="color: ${category.color}">
              <span class="material-symbols-outlined">${category.icon}</span>
            </div>
            <p class="text-app-text-main text-base font-semibold flex-1 truncate">${category.name}</p>
          </div>
        </div>
        <div class="flex flex-col">
          ${renderCategoryPrayers(category.id, isActive)}
        </div>
      </div>
    `;
  }).join("");
}

function renderCategoryPrayers(categoryId, isActive) {
  const categoryPrayers = prayersData.prayers.filter(prayer => prayer.category === categoryId);
  if (!categoryPrayers.length) {
    return `<div class="px-4 py-8 text-center text-app-text-secondary">Nenhuma oração</div>`;
  }

  return categoryPrayers.map(prayer => {
    const isPrayerActive = isActive && prayer.id === currentState.currentPrayer;
    const isFavorite = currentState.favorites.some(fav => fav.id === prayer.id);

    return `
      <div class="prayer-item flex items-center justify-between gap-4 px-4 py-3 border-b border-app-secondary/10 hover:bg-app-secondary/10 cursor-pointer ${isPrayerActive ? 'bg-app-highlight/20 border-l-4 border-app-highlight' : ''}"
           data-prayer="${prayer.id}" data-category="${categoryId}">
        <div class="flex-1 min-w-0">
          <p class="${isPrayerActive ? 'font-semibold text-app-highlight' : 'font-medium'} break-words">${prayer.title}</p>
          <p class="text-sm text-app-text-secondary break-words">${prayer.description}</p>
        </div>
        <button class="favorite-btn p-2 rounded-full hover:bg-app-secondary/20 ${isFavorite ? 'text-app-highlight' : 'text-app-secondary'} shrink-0"
                data-prayer="${prayer.id}" onclick="event.stopPropagation(); toggleFavorite(${prayer.id})">
          <span class="material-symbols-outlined text-xl">${isFavorite ? 'star' : 'star_outline'}</span>
        </button>
      </div>
    `;
  }).join("");
}

function renderPrayerContent() {
  const prayer = getCurrentPrayer();
  const contentArea = document.getElementById("contentArea");
  if (!contentArea) return;

  if (!prayer) {
    contentArea.innerHTML = `<div class="flex-1 flex items-center justify-center"><div class="text-center text-app-text-secondary"><p class="text-lg">Selecione uma oração</p></div></div>`;
    return;
  }

  const isFavorite = currentState.favorites.some(fav => fav.id === prayer.id);

  contentArea.innerHTML = `
    <header class="flex items-center justify-between p-4 border-b border-app-secondary/20">
      <h1 class="text-2xl font-serif font-bold text-app-text-main">${prayer.title}</h1>
      <div class="flex items-center gap-2">
        <button class="p-2 rounded-lg hover:bg-app-bg/60" onclick="decreaseFontSize()">
          <span class="material-symbols-outlined text-xl">text_decrease</span>
        </button>
        <button class="p-2 rounded-lg hover:bg-app-bg/60" onclick="increaseFontSize()">
          <span class="material-symbols-outlined text-xl">text_increase</span>
        </button>
        <button class="favorite-toggle flex items-center gap-2 px-4 py-2 rounded-lg ${isFavorite ? 'bg-app-highlight/20 text-app-highlight' : 'bg-app-bg/60 text-app-text-main'} font-semibold hover:bg-app-highlight/30"
                onclick="toggleFavorite(${prayer.id})">
          <span class="material-symbols-outlined">${isFavorite ? 'star' : 'star_outline'}</span>
          <span>${isFavorite ? 'Favoritado' : 'Favoritar'}</span>
        </button>
      </div>
    </header>
    <article class="flex-1 overflow-y-auto p-8 lg:p-12">
      <div class="max-w-prose mx-auto">
        ${formatPrayerContent(prayer.content)}
      </div>
    </article>
  `;
}

function formatPrayerContent(content) {
  return content.split("\n\n").map(paragraph =>
    `<p class="font-serif text-lg lg:text-xl leading-relaxed text-app-text-main mb-6" style="font-size: ${currentState.fontSize}px">${paragraph}</p>`
  ).join("");
}

function getCurrentPrayer() {
  return prayersData.prayers.find(prayer => prayer.id === currentState.currentPrayer);
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  document.addEventListener("click", function(e) {
    if (e.target.closest(".prayer-item")) {
      const prayerElement = e.target.closest(".prayer-item");
      const prayerId = parseInt(prayerElement.dataset.prayer);
      const categoryId = prayerElement.dataset.category;
      selectPrayer(prayerId, categoryId);
    }
  });
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const prayerItems = document.querySelectorAll(".prayer-item");
  prayerItems.forEach(item => {
    const title = item.querySelector("p:first-child").textContent.toLowerCase();
    const description = item.querySelector("p:last-child").textContent.toLowerCase();
    const matches = title.includes(searchTerm) || description.includes(searchTerm);
    item.style.display = matches ? "flex" : "none";
  });
}

function selectPrayer(prayerId, categoryId) {
  currentState.currentPrayer = prayerId;
  currentState.currentCategory = categoryId;
  saveAppState();
  initializeInterface();
}

function toggleFavorite(prayerId) {
  const prayer = prayersData.prayers.find(p => p.id === prayerId);
  if (!prayer) return;

  const index = currentState.favorites.findIndex(f => f.id === prayerId);
  if (index > -1) {
    currentState.favorites.splice(index, 1);
  } else {
    currentState.favorites.push({
      id: prayer.id,
      title: prayer.title,
      category: prayer.category,
      dateAdded: new Date().toISOString()
    });
  }

  saveAppState();
  initializeInterface();
}

function decreaseFontSize() {
  if (currentState.fontSize > 14) {
    currentState.fontSize -= 2;
    saveAppState();
    renderPrayerContent();
  }
}

function increaseFontSize() {
  if (currentState.fontSize < 24) {
    currentState.fontSize += 2;
    saveAppState();
    renderPrayerContent();
  }
}

function setupPanelResizer() {
  const categoriesPanel = document.getElementById("categoriesPanel");
  const panelResizer = document.getElementById("panelResizer");
  const sidebar = document.getElementById("sidebar");

  if (!categoriesPanel || !panelResizer) return;

  const savedWidth = parseInt(localStorage.getItem("oracaoCategoriesPanelWidth"), 10);
  if (!Number.isNaN(savedWidth)) {
    const clamped = Math.min(520, Math.max(260, savedWidth));
    categoriesPanel.style.width = clamped + "px";
  }

  let isResizing = false;

  panelResizer.addEventListener("mousedown", function () {
    isResizing = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", function (e) {
    if (!isResizing) return;

    const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;
    let newWidth = e.clientX - sidebarWidth;

    if (newWidth < 260) newWidth = 260;
    if (newWidth > 520) newWidth = 520;

    categoriesPanel.style.width = newWidth + "px";
  });

  document.addEventListener("mouseup", function () {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    const finalWidth = parseInt(categoriesPanel.style.width || categoriesPanel.offsetWidth, 10);
    localStorage.setItem("oracaoCategoriesPanelWidth", String(finalWidth));
  });
}
