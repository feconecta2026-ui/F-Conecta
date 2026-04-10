window.FeUI = {
  renderSidebar(activePage) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="fe-sidebar-brand">
        <h1>FéConecta</h1>
        <p>Seu guia espiritual</p>
      </div>

      <div class="fe-user-profile">
        <div class="fe-user-avatar"></div>
        <div class="fe-user-info">
          <h2 id="userName">Usuário</h2>
          <p id="userEmail">usuario@email.com</p>
        </div>
      </div>

      <nav class="fe-sidebar-nav">
        ${this.link("inicio", "home", "Início", FeConfig.ROUTES.HOME, activePage)}
        ${this.link("oracao", "menu_book", "Orações", FeConfig.ROUTES.PRAYERS, activePage)}
        ${this.link("vida", "groups", "Vida dos Santos", FeConfig.ROUTES.SAINTS, activePage)}
        ${this.link("terco", "health_and_safety", "Santo Rosário", FeConfig.ROUTES.ROSARY, activePage)}
        ${this.link("musica", "music_note", "Música", FeConfig.ROUTES.MUSIC, activePage)}
        ${this.link("devocional", "today", "Devocional", FeConfig.ROUTES.DEVOTIONAL, activePage)}
        ${this.link("favoritos", "star", "Favoritos", FeConfig.ROUTES.FAVORITES, activePage)}
        ${this.link("configuracoes", "settings", "Configurações", FeConfig.ROUTES.CONFIG, activePage)}
      </nav>
    `;

    this.applyUser();
  },

  link(id, icon, label, href, activePage) {
    const activeClass = activePage === id ? "active" : "";
    return `<a href="${href}" class="fe-nav-item ${activeClass}"><span class="material-symbols-outlined fe-nav-icon">${icon}</span><span class="fe-nav-text">${label}</span></a>`;
  },

  applyUser() {
    if (!window.FeState) return;
    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");
    if (nameEl) nameEl.textContent = FeState.getUserName();
    if (emailEl) emailEl.textContent = FeState.getUserEmail();
  },

  protectPage() {
    if (!window.FeState) return;
    const user = FeState.getUser();
    if (!user) window.location.href = "../FéConecta.html";
  }
};
