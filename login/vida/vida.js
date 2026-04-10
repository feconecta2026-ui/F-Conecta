let saintsData = { saints: [] };
let filteredSaints = [];

document.addEventListener("DOMContentLoaded", async function () {
  await loadSaints();
  setupSaintsEvents();
  renderSaints(saintsData.saints);
});

async function loadSaints() {
  try {
    const response = await fetch("../data/saints.json");
    saintsData = await response.json();
    filteredSaints = saintsData.saints;
  } catch (error) {
    console.error("Erro ao carregar saints.json:", error);
    saintsData = { saints: [] };
    filteredSaints = [];
  }
}

function renderSaints(list) {
  const grid = document.getElementById("saintsGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #6C5A4B;">
        Nenhum santo encontrado.
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(saint => `
    <div class="saint-card">
      <div class="saint-image" style="background-image: url('${saint.image}');"></div>
      <div class="saint-info">
        <p class="saint-name">${saint.name}</p>
        <p class="saint-feast">Festa em ${saint.feastDay}</p>
      </div>
    </div>
  `).join("");
}

function setupSaintsEvents() {
  const searchInput = document.getElementById("saintSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const term = e.target.value.toLowerCase().trim();

      const result = saintsData.saints.filter(saint =>
        saint.name.toLowerCase().includes(term) ||
        (saint.description || "").toLowerCase().includes(term) ||
        (saint.feastDay || "").toLowerCase().includes(term)
      );

      filteredSaints = result;
      renderSaints(filteredSaints);
    });
  }
}
