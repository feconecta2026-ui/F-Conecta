document.addEventListener("DOMContentLoaded", function () {
  // Dados das orações completas
  const prayersData = {
    "pai-nosso": {
      title: "Pai Nosso",
      category: "Oração da Manhã",
      content: `
                <p class="mb-4">Pai nosso que estais nos céus, santificado seja o Vosso nome.</p>
                <p class="mb-4">Venha a nós o Vosso reino, seja feita a Vossa vontade, assim na terra como no céu.</p>
                <p class="mb-4">O pão nosso de cada dia nos dai hoje.</p>
                <p class="mb-4">Perdoai as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido.</p>
                <p class="mb-4">E não nos deixeis cair em tentação, mas livrai-nos do mal.</p>
                <p class="mb-4">Amém.</p>
            `,
    },
    "sao-francisco": {
      title: "Oração a São Francisco",
      category: "Oração da Paz",
      content: `
                <p class="mb-4">Senhor, fazei-me instrumento de vossa paz.</p>
                <p class="mb-4">Onde houver ódio, que eu leve o amor.</p>
                <p class="mb-4">Onde houver ofensa, que eu leve o perdão.</p>
                <p class="mb-4">Onde houver discórdia, que eu leve a união.</p>
                <p class="mb-4">Onde houver dúvidas, que eu leve a fé.</p>
                <p class="mb-4">Onde houver erro, que eu leve a verdade.</p>
                <p class="mb-4">Onde houver desespero, que eu leve a esperança.</p>
                <p class="mb-4">Onde houver tristeza, que eu leve a alegria.</p>
                <p class="mb-4">Onde houver trevas, que eu leve a luz.</p>
                <p class="mb-4">Ó Mestre, fazei que eu procure mais consolar, que ser consolado;</p>
                <p class="mb-4">compreender, que ser compreendido;</p>
                <p class="mb-4">amar, que ser amado.</p>
                <p class="mb-4">Pois é dando que se recebe, é perdoando que se é perdoado, e é morrendo que se vive para a vida eterna.</p>
                <p class="mb-4">Amém.</p>
            `,
    },
    "ave-maria": {
      title: "Ave Maria",
      category: "Oração da Noite",
      content: `
                <p class="mb-4">Ave Maria, cheia de graça, o Senhor é convosco.</p>
                <p class="mb-4">Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus.</p>
                <p class="mb-4">Santa Maria, Mãe de Deus, rogai por nós, pecadores,</p>
                <p class="mb-4">agora e na hora da nossa morte.</p>
                <p class="mb-4">Amém.</p>
            `,
    },
  };

  // Elementos DOM
  const filterButton = document.getElementById("filterButton");
  const filterMenu = document.getElementById("filterMenu");
  const searchInput = document.getElementById("searchInput");
  const prayersContainer = document.getElementById("prayersContainer");
  const prayerCards = document.querySelectorAll(".card-hover");
  const favoriteButtons = document.querySelectorAll(".favorite-toggle");
  const viewPrayerButtons = document.querySelectorAll(".view-prayer");
  const prayerModal = document.getElementById("prayerModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Alternar menu de filtro
  filterButton.addEventListener("click", function () {
    filterMenu.classList.toggle("hidden");
  });

  // Fechar menu de filtro ao clicar fora
  document.addEventListener("click", function (event) {
    if (
      !filterButton.contains(event.target) &&
      !filterMenu.contains(event.target)
    ) {
      filterMenu.classList.add("hidden");
    }
  });

  // Filtrar orações por categoria
  const filterButtons = filterMenu.querySelectorAll("button[data-filter]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Atualizar visualização dos botões de filtro
      filterButtons.forEach((btn) => {
        const icon = btn.querySelector(".material-symbols-outlined");
        icon.textContent = "check_box_outline_blank";
      });
      const icon = this.querySelector(".material-symbols-outlined");
      icon.textContent = "check_box";

      // Aplicar filtro
      prayerCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });

      filterMenu.classList.add("hidden");
    });
  });

  // Buscar orações
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();

    prayerCards.forEach((card) => {
      const title = card.querySelector("p.text-lg").textContent.toLowerCase();
      const description = card
        .querySelector("p.text-sm")
        .textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Alternar favorito
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const icon = this.querySelector(".material-symbols-outlined");

      if (icon.classList.contains("fill-icon")) {
        icon.classList.remove("fill-icon");
        this.setAttribute("title", "Adicionar aos favoritos");
        // Aqui você poderia adicionar lógica para remover dos favoritos no backend
      } else {
        icon.classList.add("fill-icon");
        this.setAttribute("title", "Remover dos favoritos");
        // Aqui você poderia adicionar lógica para adicionar aos favoritos no backend
      }
    });
  });

  // Abrir modal com oração completa
  viewPrayerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const prayerId = this.getAttribute("data-prayer");
      const prayer = prayersData[prayerId];

      if (prayer) {
        modalTitle.textContent = prayer.title;
        modalContent.innerHTML = `
                    <p class="text-text-secondary text-sm mb-4">${prayer.category}</p>
                    ${prayer.content}
                `;
        prayerModal.classList.remove("hidden");
      }
    });
  });

  // Fechar modal
  closeModal.addEventListener("click", function () {
    prayerModal.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", function () {
    prayerModal.classList.add("hidden");
  });

  // Fechar modal ao clicar fora
  prayerModal.addEventListener("click", function (event) {
    if (event.target === prayerModal) {
      prayerModal.classList.add("hidden");
    }
  });
});
